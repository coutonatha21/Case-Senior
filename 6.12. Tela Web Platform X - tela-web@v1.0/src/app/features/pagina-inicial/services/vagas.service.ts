import { HttpClient, HttpRequest, HttpHandler } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Vagas } from '../models/vagas.model';

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private readonly basePayload = {
    id: 'b0d5b4d8-a857-4261-bb7e-efa6342296e1',
    inputData: {
      module: 'rubi',
      server: `http://${environment.server.acces}:8080`,
      port: 'CRUD_Vagas',
      service: 'case.senior.gestao.estacionamento',
      encryption: '3',
      user: '',
      password: '',
      rootObject: '',
    },
  };

  private http = inject(HttpClient);

  public obterVagas(tipOpe: string, codEst: string): Observable<Vagas> {
    const payload = {
      ...this.basePayload,
      inputData: {
        ...this.basePayload.inputData,
        TipOpe: tipOpe,
        retVag: {
          CodEst: codEst,
        },
      },
    };

    console.log('Payload enviado para obter vagas:', payload);

    return this.http.post<Vagas>(environment.plugin.invoke, payload);
  }
}
