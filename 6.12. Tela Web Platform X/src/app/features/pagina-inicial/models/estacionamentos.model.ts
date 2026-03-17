export interface Estacionamento {
  codEst: string;
  desEst: string;
  qtdVag: string;
  vagDis: string;
  vagOcu: string;
}

export interface Estacionamentos {
  outputData: {
    responseCode: number;
    retEst: Estacionamento[];
  };
}
