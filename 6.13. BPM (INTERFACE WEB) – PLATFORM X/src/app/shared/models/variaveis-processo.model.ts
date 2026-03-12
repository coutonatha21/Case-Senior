import { DadosSolicitante } from "./colaboradores.model";
import { DadosVeiculosDTO } from "./veiculo.model";

export interface VariaveisProcessoDTO{
  nomeSolicitante: string;
  dadosSolicitante: DadosSolicitante
  dadosVeiculo: DadosVeiculosDTO 
  statusProcesso: string;
}

export interface VariaveisProcessoG7DTO{
  nomeSolicitante?: string;
  dadosSolicitante?: string;
  dadosVeiculo?: string;
  statusProcesso?: string;
}