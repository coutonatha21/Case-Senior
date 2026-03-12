import { CampoModel } from "@senior-hcm-service-tower/hst-dados/model/campo.model";
import { DadosVeiculo } from "src/app/shared/models/veiculo.model";

export function montaCamposVeiculo(veic: DadosVeiculo): CampoModel[]{
  return [
    {
      label: "Placa",
      valor: veic.PlaVei,
      tamanho: "P"
    },
    {
      label: "Modelo",
      valor: veic.ModVei,
      tamanho: "P"
    },
    {
      label: "Cor",
      valor: veic.CorVei,
      tamanho: "P"
    },
    {
      label: "Ano",
      valor: veic.AnoVei,
      tamanho: "P"
    }
  ]
} 