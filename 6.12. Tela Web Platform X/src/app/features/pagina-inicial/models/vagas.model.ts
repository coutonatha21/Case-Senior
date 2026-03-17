export interface Veiculo {
  anoVei: string;
  codEst: string;
  corVei: string;
  modVei: string;
  nomEmp: string;
  nomFun: string;
  numCad: string;
  numEmp: string;
  plaVei: string;
  tipCol: string;
}

export interface Estacionamento {
  codEst: string;
  retVei?: Veiculo | Veiculo[];
  totVag: string;
  vagDis: string;
  vagOcu: string;
}

export interface Vagas {
  outputData: {
    retMsg: string;
    retVag: Estacionamento[];
    responseCode: number;
  };
}
