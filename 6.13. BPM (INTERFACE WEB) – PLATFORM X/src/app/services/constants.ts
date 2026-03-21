export type Module =
  | 'rubi'
  | 'ronda'
  | 'bs'
  | 'cs'
  | 'jr'
  | 'plr'
  | 'ql'
  | 'rs'
  | 'sm'
  | 'tr';

export const rubi = {
  name: 'rubi' as Module,
  treinamento: {
    service: "com.senior.case.gestaoEstacionamento",
    ports:{
      solicitante: "Solicitante",
      veiculo: "CRUD_Veiculos"
    }
  }
}
