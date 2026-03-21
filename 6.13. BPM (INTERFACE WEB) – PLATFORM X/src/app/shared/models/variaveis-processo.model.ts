import { DadosSolicitante } from "./colaboradores.model";
import { DadosVeiculo, Observacao } from "./veiculo.model";

export interface VariaveisProcessoDTO{
  dadosSolicitante: DadosSolicitante;
  dadosVeiculo: DadosVeiculo;
  observacao: Observacao;
}

export interface VariaveisProcessoG7DTO{
  dadosSolicitante?: string;
  dadosVeiculo?: string;
  observacao?: string;
}