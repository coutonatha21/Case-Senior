import { CampoModel } from "@senior-hcm-service-tower/hst-dados/model/campo.model";
import { Observacao } from "src/app/shared/models/veiculo.model";

export function montaCamposObservacao(obs: Observacao): CampoModel[]{
  return [
    {
      label: "",
      valor: obs.observacao,
      tamanho: "P"
    }
  ]
}