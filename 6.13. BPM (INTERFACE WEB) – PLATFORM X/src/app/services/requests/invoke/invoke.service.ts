import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, firstValueFrom, map, Observable, take, throwError } from 'rxjs';
import { OutputData, ResponseModel } from '../models/response.model';
import { environment } from 'src/environments/environment';
import { parse } from 'date-fns';
import { ErrorMessages } from '../models/error.model';
import { TicketRequestResponse } from '../models/ticket-request-response.model';
import { Module } from '@services/constants';
import { buildBody } from './body.make';

@Injectable({ providedIn: 'root' })
export class InvokeService {
  private readonly errorMessages: ErrorMessages = {
    401: 'Erro de autenticação. Verifique suas credenciais e tente novamente.',
    403: 'Acesso negado. Você não tem permissão para acessar este recurso.',
    404: 'Recurso não encontrado.',
    500: 'Erro no servidor. Por favor, tente novamente mais tarde.',
    504: 'Tempo de resposta esgotado. O servidor não conseguiu responder a solicitação no tempo limite.',
  };

  constructor(
    private http: HttpClient
  ) {}

  obterDadosXT<T extends OutputData>(
    service: string,
    port: string,
    module: Module,
    args: Record<string, string | number | Date> = {},
    typedResponse: boolean | unknown = false
  ): Observable<T> {

    const body = buildBody(
      service,
      port,
      args,
      module != 'rubi' ? 
        module : 'rubi'
    )

    return this.http.post<ResponseModel<T>>(environment.urls.invoke, body).pipe(
      take(1),
      map((response) => {
        this.handleRespostaXT(response.outputData)

        if (typedResponse) {
          return this.parseResponse<T>(response.outputData).outputData;
        }

        return response.outputData;
      }),
      catchError(err => {
        console.error('Ocorreu um erro no obterDadosXT:', err);
        throw new Error("Ocorreu um erro ao carregar os dados, favor contate um administrador.");
      }),
    );
  }

  async verificaUsuarioNoPapelPlataforma(
    nomeUsuario: string,
    nomePapel: string | string[]
  ): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<{
        roles: { id: string; name: string; description: string }[];
      }>(
        'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/authorization/queries/getUserDetailRoles',
        { user: nomeUsuario }
      )
    )

    const papeisValidos = (Array.isArray(nomePapel) ? nomePapel : [nomePapel])
    .map(p => p.toUpperCase());

    return response.roles.some(
      role => papeisValidos.includes(role.name.toUpperCase())
    );
  }
  
  envioEmailUsarioSeniorX(
    assunto: string,
    corpo: string,
    destinatarios: string[]
  ): Observable<ResponseModel<OutputData>> {
    const body = {
      inputData: {
        subject: assunto,
        content: corpo,
        to: destinatarios,
      },
      id: environment.email_plugin_id,
    };

    return this.http.post<ResponseModel<OutputData>>(environment.urls.invoke, body).pipe(
      take(1),
      map((response) => {
        const { responseCode: codigoResposta, message: error } =
          response.outputData || {};
        if (codigoResposta !== 200) {
          this.handleErrorResponse(codigoResposta, error);
        }
        return response;
      })
    );
  }

  private handleRespostaXT(response: OutputData){
    this.handleErrorResponse(response.responseCode, response.message);
    if(response.message){
      throw new Error(response.message)
    }
    if(response.responseCode == 200){
      if(response.ARetorno && response.ARetorno.toLocaleUpperCase() != "OK"){
        throw new Error(response.ARetorno);
      }
    }
    return;
  }

  private handleErrorResponse(codigoResposta: number, error: string | undefined) {
    if (codigoResposta >= 500) {
      if (codigoResposta === 504) {
        throw new Error(this.errorMessages[504]);
      }
      throw new Error(this.errorMessages[500]);
    }
    if (codigoResposta >= 400) {
      this.handleClientError(error);
      return;
    }
    const errorMessage = this.errorMessages[codigoResposta];
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }

  private handleClientError(error: string | undefined) {
    const userNotFoundMessage =
      'Não foi possível localizar o usuário no XT, verifique se está configurado corretamente no módulo Administração de Pessoas > Colaboradores > Ficha Cadastral > Empregados.';
    throw new Error(
      error?.includes(userNotFoundMessage) ? 
      userNotFoundMessage : error ? 
      error : 'Erro na requisição. Verifique os dados enviados.'
    )
  }  

  private parseResponse<T extends OutputData>(data: T): ResponseModel<T> {
    const parsedObj = this.convertStringsToTypes(data);
    return { outputData: parsedObj };
  }

  private convertStringsToTypes<T>(obj: T): T {
    for (const key in obj) {
      const type = key.substring(0, 1).toLocaleUpperCase();

      if (type === 'L' && obj[key] && Array.isArray(obj[key])) {
        obj[key] = (obj[key] as unknown[]).map((item: unknown) =>
          this.convertStringsToTypes(item)
        ) as T[Extract<keyof T, string>];
      } else if (type === 'L' && obj[key] && typeof obj[key] === 'object') {
        obj[key] = [
          this.convertStringsToTypes(obj[key]),
        ] as unknown as T[Extract<keyof T, string>];
      } else if (typeof obj[key] === 'string') {
        if (obj[key] && type && type === 'N') {
          obj[key] = parseFloat(obj[key]) as unknown as T[Extract<
            keyof T,
            string
          >];
        }
        if (obj[key] && type && type === 'D') {
          if (typeof obj[key] === 'string') {
            obj[key] = this.parseBrazilianDate(
              obj[key]
            ) as unknown as T[Extract<keyof T, string>];
          }
        }
      }
    }
    return obj;
  }

  private parseBrazilianDate(dateString: string): Date | null {
    try {
      return parse(dateString, 'dd/MM/yyyy', new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      throw new Error('Formato de data inválido');
    }
  }
}


