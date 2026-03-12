import { CampoModel } from "@senior-hcm-service-tower/hst-dados/model/campo.model";
import { DadosSolicitante } from "src/app/shared/models/colaboradores.model";

export function montaCamposColaborador(colab: DadosSolicitante): CampoModel[]{
  return [
    {
      label: "Matrícula",
      valor: String(colab.NNumCad),
      tamanho: "P"
    },
    {
      label: "Nome",
      valor: colab.ANomFun,
      tamanho: "P"
    },
    {
      label: "Empresa",
      valor: `${String(colab.NNumEmp)} - ${colab.ANomEmp}`,
      tamanho: "M"
    },
    {
      label: "Filial",
      valor: `${String(colab.NCodFil)} - ${colab.ANomFil}`,
      tamanho: "P"
    },
    {
      label: "Centro de custo",
      valor: `${colab.ACodCCU} - ${colab.ANomCCU}`,
      tamanho: "P"
    },
    {
      label: "Posto de Trabalho",
      valor: `${colab.APosTra} - ${colab.ADesPos}`,
      tamanho: "M"
    }
  ]
}