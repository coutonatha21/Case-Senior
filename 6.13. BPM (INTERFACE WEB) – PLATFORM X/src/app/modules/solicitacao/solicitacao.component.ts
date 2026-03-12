import { ComponenteLoadingService } from '../../services/utils/componente-loading.service';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { EtapaControlService, EtapaWorkflow } from '@services/utils/etapa-control.service';
import { WfFormData } from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { DadosSolicitanteComponent } from '@components/dados-solicitante/dados-solicitante.component';
import { DadosVeiculoComponent } from '@components/dados-veiculo/dados-veiculo.component';
import { SeniorXTService } from '@services/requests/seniorXT.service';
import { VariaveisProcessoG7DTO } from '../../shared/models/variaveis-processo.model';
import { NotificationService } from '@services/utils/notification.service';
import { catchError, EMPTY, finalize, take } from 'rxjs';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrl: './solicitacao.component.scss',
})
export class SolicitacaoComponent implements OnInit, AfterViewInit {
  
  @ViewChild(DadosSolicitanteComponent, { static: false })
  dadosSolicitanteComponent!: DadosSolicitanteComponent;

  @ViewChild(DadosVeiculoComponent, { static: false })
  dadosVeiculoComponent!: DadosVeiculoComponent;

  nomeSolicitante!: string;

  constructor(
    private wfService: WorkflowService,
    private componenteLoadingService: ComponenteLoadingService,
    private etapaControlService: EtapaControlService,
    private seniorXT: SeniorXTService,
    private notification: NotificationService
  ) {
    this.etapaControlService.setEtapaAtual(EtapaWorkflow.SOLICITACAO);
    this.wfService.onSubmit(this.enviarFormulario.bind(this));
    
    try {
      this.nomeSolicitante = this.wfService.getUser().username;
    } catch (error) {
      console.warn('Usuário não disponível no contexto de teste');
      this.nomeSolicitante = 'usuario_teste';
    }
  }
  
  ngOnInit(): void {
    this.componenteLoadingService.iniciarLoadingDinamico();
  }

  ngAfterViewInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    if (!this.dadosSolicitanteComponent || !this.dadosVeiculoComponent) {
      console.warn('Componentes não inicializados ainda');
      return;
    }

    this.seniorXT.dadosSolicitante(this.nomeSolicitante).pipe(
      take(1),
      catchError((err) => {
        console.error('Erro ao buscar dados do solicitante:', err);
        this.notification.requestError('Erro ao carregar dados do solicitante.');
        return EMPTY;
      }),
      finalize(() => {
        this.componenteLoadingService.finalizarLoadingDinamico();
      })
    ).subscribe(
      (response) => {
        this.dadosSolicitanteComponent.inicializarComponente(response);
      }
    );
  }

  formulariosValidos(): boolean {
    const solicitanteValido = this.dadosSolicitanteComponent?.formularioValido();
    const veiculoValido = this.dadosVeiculoComponent?.formularioValido();

    return solicitanteValido && veiculoValido;
  }

  montaFormData(): VariaveisProcessoG7DTO {
    return {
      nomeSolicitante: this.nomeSolicitante,
      dadosSolicitante: JSON.stringify(this.dadosSolicitanteComponent?.retornaValores() || {}),
      dadosVeiculo: JSON.stringify(this.dadosVeiculoComponent?.retornaValores() || {})
    };
  }

  async enviarFormulario(): Promise<WfFormData | undefined> {
    try {
      if (!this.formulariosValidos()) {
        this.wfService.abortSubmit();
        return;
      }

      return {
        formData: this.montaFormData()
      };
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      this.wfService.abortSubmit();
    }
  }
}
