export interface Estacionamento {
  codEst: string;
  desEst: string;
  qtdVag: string;
}

export interface Estacionamentos {
  outputData: {
    responseCode: number;
    retEst: Estacionamento[];
  };
}