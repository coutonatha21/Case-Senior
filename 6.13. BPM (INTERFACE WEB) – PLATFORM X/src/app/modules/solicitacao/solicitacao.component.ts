import { ComponenteLoadingService } from '../../services/utils/componente-loading.service';
import { Component, ViewChild } from '@angular/core';
import {
  EtapaControlService,
  EtapaWorkflow,
} from '@services/utils/etapa-control.service';
import { WfFormData } from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { DadosSolicitanteComponent } from '@components/dados-solicitante/dados-solicitante.component';
import { DadosVeiculoComponent } from '@components/dados-veiculo/dados-veiculo.component';
import { SeniorXTService } from '@services/requests/seniorXT.service';
import { EtapaModel } from 'src/app/modules/etapa.model';
import { VariaveisProcessoG7DTO } from '../../shared/models/variaveis-processo.model';
import { NotificationService } from '@services/utils/notification.service';
import { InvokeService } from '../../services/requests/invoke/invoke.service';
import { catchError, EMPTY, finalize, take } from 'rxjs';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrl: './solicitacao.component.scss',
})
export class SolicitacaoComponent implements EtapaModel{
  
  @ViewChild(DadosSolicitanteComponent, {static: true})
  dadosSolicitanteComponent!: DadosSolicitanteComponent;

  @ViewChild(DadosVeiculoComponent, {static: true})
  dadosVeiculoComponent!: DadosVeiculoComponent;

  nomeSolicitante!: string;

  constructor(
    private wfService: WorkflowService,
    private componenteLoadingService: ComponenteLoadingService,
    private etapaControlService: EtapaControlService,
    private seniorXT: SeniorXTService,
    private invoke: InvokeService,
    private notification: NotificationService
  ) {
    this.etapaControlService.setEtapaAtual(EtapaWorkflow.SOLICITACAO);
    this.wfService.onSubmit(this.enviarFormulario.bind(this));
  }
  
  ngOnInit(): void {
    this.componenteLoadingService.iniciarLoadingDinamico();
  }

  ngAfterViewInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.seniorXT.dadosSolicitante(this.nomeSolicitante).pipe(
      take(1),
      catchError((err) => {
        this.notification.requestError(err);
        return EMPTY;
      }),
      finalize(() => {this.componenteLoadingService.finalizarLoadingDinamico()})
    ).subscribe(
      (response) => {
        this.dadosSolicitanteComponent.inicializarComponente(response);
      }
    ) 
  }

  formulariosValidos(): boolean {
    const solicitanteValido = this.dadosSolicitanteComponent.formularioValido();
    const veiculoValido = this.dadosVeiculoComponent.formularioValido();

    return solicitanteValido && veiculoValido;
  }

  async enviarFormulario(): Promise<WfFormData | undefined> {
    try{
      if(!this.formulariosValidos()){
        this.wfService.abortSubmit();
      }

      return {
        formData: this.montaFormData()
      };
    }catch(error){
      console.error(error);
      this.wfService.abortSubmit();
    }
  }

  montaFormData(): VariaveisProcessoG7DTO{
    return {
      dadosSolicitante: JSON.stringify(this.dadosSolicitanteComponent.retornaValores()),
      dadosVeiculo: JSON.stringify(this.dadosVeiculoComponent.retornaValores())
    }
  }
}
