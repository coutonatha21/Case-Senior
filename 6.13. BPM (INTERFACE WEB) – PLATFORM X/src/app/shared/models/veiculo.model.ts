import { OutputData } from "@services/requests/models/response.model";

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

export interface RetornoDadosVeiculosDTO extends DadosVeiculosDTO, OutputData {
  
}
