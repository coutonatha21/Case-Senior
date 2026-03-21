import { ComponenteLoadingService } from '../../services/utils/componente-loading.service';
import { Component, ViewChild } from '@angular/core';
import {
  EtapaControlService,
  EtapaWorkflow,
} from '@services/utils/etapa-control.service';
import {
  WfFormData,
  WfProcessStep,
} from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { DadosSolicitanteComponent } from '@components/dados-solicitante/dados-solicitante.component';
import { DadosVeiculoComponent } from '@components/dados-veiculo/dados-veiculo.component';
import { SeniorXTService } from '@services/requests/seniorXT.service';
import { EtapaModel } from 'src/app/modules/etapa.model';
import {
  VariaveisProcessoDTO,
  VariaveisProcessoG7DTO,
} from '../../shared/models/variaveis-processo.model';
import { NotificationService } from '@services/utils/notification.service';
import { InvokeService } from '../../services/requests/invoke/invoke.service';
import { ObservacaoComponent } from '@components/observacao/observacao.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-aprovacao',
  templateUrl: './aprovacao.component.html',
  styleUrl: './aprovacao.component.scss',
})
export class AprovacaoComponent implements EtapaModel {
  @ViewChild(DadosSolicitanteComponent, { static: true })
  dadosSolicitanteComponent!: DadosSolicitanteComponent;

  @ViewChild(DadosVeiculoComponent, { static: true })
  dadosVeiculoComponent!: DadosVeiculoComponent;

  @ViewChild(ObservacaoComponent, { static: true })
  observacaoComponent!: ObservacaoComponent;

  nomeSolicitante!: string;
  variaveisProcesso!: VariaveisProcessoDTO;

  constructor(
    private wfService: WorkflowService,
    private componenteLoadingService: ComponenteLoadingService,
    private etapaControlService: EtapaControlService,
    private seniorXT: SeniorXTService,
    private invoke: InvokeService,
    private notification: NotificationService,
  ) {
    this.etapaControlService.setEtapaAtual(EtapaWorkflow.APROVACAO);
    this.wfService.onSubmit(this.enviarFormulario.bind(this));
    this.nomeSolicitante = this.wfService.getUser().username;
  }

  ngOnInit(): void {
    this.componenteLoadingService.iniciarLoadingDinamico();
  }

  ngAfterViewInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.wfService
      .requestProcessVariables()
      .then((variaveis) => {
        this.variaveisProcesso = variaveis as VariaveisProcessoDTO;

        this.dadosSolicitanteComponent.preencherFormulario(
          this.variaveisProcesso.dadosSolicitante,
        );
        this.dadosSolicitanteComponent.limparValidadores();
        this.dadosSolicitanteComponent.desabilitarCampos();

        this.dadosVeiculoComponent.preencherFormulario(
          this.variaveisProcesso.dadosVeiculo,
        );
        this.dadosVeiculoComponent.limparValidadores();
        this.dadosVeiculoComponent.desabilitarCampos();

        if (this.variaveisProcesso.observacao?.observacao) {
          this.observacaoComponent.preencherFormulario(
            this.variaveisProcesso.observacao.observacao,
          );
        }
      })
      .finally(() => {
        this.componenteLoadingService.finalizarLoadingDinamico();
      });
  }

  formulariosValidos(): boolean {
    const solicitanteValido = this.dadosSolicitanteComponent.formularioValido();
    const veiculoValido = this.dadosVeiculoComponent.formularioValido();

    return solicitanteValido && veiculoValido;
  }

  montaFormData(): VariaveisProcessoG7DTO {
    return {
      dadosSolicitante: JSON.stringify(
        this.dadosSolicitanteComponent.retornaValores(),
      ),
      dadosVeiculo: JSON.stringify(this.dadosVeiculoComponent.retornaValores()),
      observacao: JSON.stringify({
        observacao: this.observacaoComponent.retornaValores(),
      }),
    };
  }

  async enviarFormulario(step: WfProcessStep): Promise<WfFormData | undefined> {
    if (step.nextAction?.name === 'Enviar para Revisão') {
      const observacaoControl = this.observacaoComponent.formulario.get('observacao');
      observacaoControl?.markAsTouched();
      observacaoControl?.markAsDirty();
      observacaoControl?.updateValueAndValidity();

      const observacao = this.observacaoComponent.retornaValores()?.trim();
      if (!observacao || observacao === 'N/A') {
        this.notification.formError(
          'É necessário adicionar uma observação para enviar para revisão.',
        );
        this.wfService.abortSubmit();
        return;
      }
    }

    if (step.nextAction?.name === 'Aprovar Cadastro') {
      try {
        await firstValueFrom(
          this.seniorXT.criarNovoVeiculo(
            this.dadosVeiculoComponent.retornaValores(),
            this.dadosSolicitanteComponent.retornaValores(),
          )
        );
        this.notification.success('Veículo cadastrado com sucesso!');
      } catch (erro) {
        this.notification.requestError(
          'Não foi possível cadastrar o veículo no XT. Verifique os dados e tente novamente.',
        );
        this.wfService.abortSubmit();
        return;
      }
    }

    try {
      if (!this.formulariosValidos()) {
        this.wfService.abortSubmit();
      }

      return {
        formData: this.montaFormData(),
      };
    } catch (error) {
      console.error(error);
      this.wfService.abortSubmit();
    }
  }
}
