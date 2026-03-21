import { map, Observable, take } from "rxjs";
import { RetornoDadosSolicitanteDTO } from "src/app/shared/models/colaboradores.model";
import { InvokeService } from "./invoke/invoke.service";
import { Injectable } from "@angular/core";
import { rubi } from "@services/constants";
import { DadosVeiculosDTO, RetornoVeiculosDTO } from "src/app/shared/models/veiculo.model";
import { DadosSolicitanteDTO } from "src/app/shared/models/colaboradores.model";

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
  

  criarNovoVeiculo(
    dadosVeiculo: DadosVeiculosDTO,
    identificacao: Pick<DadosSolicitanteDTO, 'NNumEmp' | 'NTipCol' | 'NNumCad'>
  ): Observable<RetornoVeiculosDTO> {
    return this.invoke.obterDadosXT<RetornoVeiculosDTO>(
      rubi.treinamento.service,
      rubi.treinamento.ports.veiculo,
      rubi.name,
      {
        TipOpe: 'C',
        RetVei: [{
          ...dadosVeiculo,
          NumEmp: identificacao.NNumEmp,
          TipCol: identificacao.NTipCol,
          NumCad: identificacao.NNumCad,
        }],
      } as any,
      true
    );
  }

}

