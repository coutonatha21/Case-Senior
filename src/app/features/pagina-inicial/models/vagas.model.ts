export interface Vaga {
  anoVei: string;
  corVei: string;
  modVei: string;
  nomEmp: string;
  nomFun: string;
  numCad: string;
  numEmp: string;
  plaVei: string;
  tipCol: string;
}

export interface Vagas {
  outputData: {
    retVag: Vaga[];
    totVag: string;
    vagDis: string;
    vagOcu: string;
    responseCode: number;
  };
}
