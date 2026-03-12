import {  map, Observable, take } from "rxjs";
import { RetornoDadosSolicitanteDTO } from "src/app/shared/models/colaboradores.model";
import { InvokeService } from "./invoke/invoke.service";
import { Injectable } from "@angular/core";
import { rubi } from "@services/constants";
import { RetornoDadosVeiculosDTO} from '..//../shared/models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class SeniorXTService {
  constructor(
    private invoke: InvokeService
  ){}

  dadosSolicitante(ANomUsu: string): Observable<RetornoDadosSolicitanteDTO>{
    return this.invoke.obterDadosXT<RetornoDadosSolicitanteDTO>(
      rubi.treinamento.service,
      rubi.treinamento.ports.solicitante, 
      rubi.name, 
      {
        ANomUsu
      }, 
      true
    )
  }

  /**
   * Cadastra um novo veículo no sistema
   * Não retorna dados, apenas confirma o cadastro
   * @param dadosVeiculo Dados do veículo a ser cadastrado
   * @returns Observable<void> - Apenas confirma sucesso da operação
   */
  cadastrarVeiculo(args?: Record<string, string>): Observable<void> {

    const dadosEnvio: any = {
      TipOpe: "C",
      RetVei: [args], 
    };

    console.log('2 - Dados enviados para cadastro: ', dadosEnvio);

    return this.invoke.obterDadosXT<RetornoDadosVeiculosDTO>(
      rubi.treinamento.service,
      rubi.treinamento.ports.veiculos,
      rubi.name,
      dadosEnvio,
      true
    ).pipe(
      take(1),
      map(() => {
        console.log('3 - Cadastro realizado com sucesso', rubi.treinamento.ports.veiculos);
        return void 0;
      })
    );
  }
}