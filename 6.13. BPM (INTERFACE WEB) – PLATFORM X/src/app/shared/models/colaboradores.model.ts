import { OutputData } from "@services/requests/models/response.model";

export class DadosSolicitante {
  NNumEmp: number = 0;
  NTipCol: number = 0;
  NNumCad: number = 0;
  ANomFun: string = "N/A";
  ANomEmp: string = "N/A";
  NCodFil: number = 0;
  ANomFil: string = "N/A";
  ACodCCU: string = "N/A";
  ANomCCU: string = "N/A";
  APosTra: string = "N/A";
  ADesPos: string = "N/A";
  AEhGestor: string = "N/A";
  
  constructor(){
  } 
}


export interface RetornoDadosSolicitanteDTO extends DadosSolicitante, OutputData {
}