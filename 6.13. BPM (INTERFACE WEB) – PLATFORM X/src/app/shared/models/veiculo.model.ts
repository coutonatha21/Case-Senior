export interface DadosVeiculosDTO{
  PlaVei: string,
  ModVei: string,
  CorVei: string,
  AnoVei: string
}

export class DadosVeiculo implements DadosVeiculosDTO{
  PlaVei: string = "N/A";
  ModVei: string = "N/A";
  CorVei: string = "N/A";
  AnoVei: string = "N/A";
  
  constructor(){
  }
}

import { OutputData } from 'src/app/services/requests/models/response.model';

export interface RetornoVeiculosDTO extends OutputData {
  RetVei?: DadosVeiculosDTO[];
}

export interface ObservacaoDTO{
  observacao: string;
}

export class Observacao implements ObservacaoDTO{
  observacao: string = "N/A";

  constructor(){
  }
}