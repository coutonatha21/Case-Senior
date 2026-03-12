import { Component, ViewChild} from '@angular/core';
import { WfFormData, WfProcessStep } from 'src/app/core/service/workflow/workflow-cockpit/dist/workflow-cockpit';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { DadosSolicitanteComponent } from '@components/dados-solicitante/dados-solicitante.component';
import { DadosVeiculoComponent } from '@components/dados-veiculo/dados-veiculo.component';
import { ComponenteLoadingService } from '../../services/utils/componente-loading.service';
import { NotificationService } from '@services/utils/notification.service';
import { firstValueFrom } from 'rxjs';
import { VariaveisProcessoDTO, VariaveisProcessoG7DTO } from '../../shared/models/variaveis-processo.model';
import { EtapaModel } from '../etapa.model';
import { SeniorXTService } from '@services/requests/seniorXT.service';

@Component({
  selector: 'app-apoio-rh',
  templateUrl: './apoio-rh.component.html',
  styleUrl: './apoio-rh.component.scss',
})
export class ApoioRhComponent implements EtapaModel{
  
  @ViewChild(DadosSolicitanteComponent, { static: false })
  dadosSolicitanteComponent!: DadosSolicitanteComponent;

  @ViewChild(DadosVeiculoComponent, { static: false })
  dadosVeiculoComponent!: DadosVeiculoComponent;

  variaveisProcesso: VariaveisProcessoDTO = {} as VariaveisProcessoDTO;
  
  constructor(
    private wfService: WorkflowService,
    private componenteLoadingService: ComponenteLoadingService,
    private seniorXT: SeniorXTService,
    private notification: NotificationService,
  ) {
    
  }

  inicializarFormulario(): void {
    this.wfService.requestProcessVariables().then(
      (variaveis)=>{
        
        this.variaveisProcesso = variaveis as VariaveisProcessoDTO;

        this.dadosSolicitanteComponent.preencherFormulario(this.variaveisProcesso.dadosSolicitante);
        this.dadosSolicitanteComponent.limparValidadores();
        this.dadosSolicitanteComponent.desabilitarCampos();

        this.dadosVeiculoComponent.preencherFormulario(this.variaveisProcesso.dadosVeiculo);
        this.dadosVeiculoComponent.limparValidadores();
        this.dadosVeiculoComponent.desabilitarCampos();
      }
    ).finally(
      ()=>{
        this.componenteLoadingService.finalizarLoadingDinamico();
      }
    )
  }

  formulariosValidos(): boolean {
    const statusProcessoValido = this.dadosSolicitanteComponent?.formularioValido();

    return true;
  }

  montaFormData(...args: any[]): VariaveisProcessoG7DTO {
    return {
      statusProcesso: args[0]
    };
  }

  async enviarFormulario(step: WfProcessStep): Promise<WfFormData | undefined> {
    if (step.nextAction.name === 'Aprovar Cadastro') {

      this.componenteLoadingService.iniciarLoadingDinamico();
      console.log('1 - Iniciando processo de integração', step.nextAction.name, 'Dados do veículo: ', this.variaveisProcesso.dadosVeiculo);

      try {
        const response = await firstValueFrom(
          this.seniorXT.cadastrarVeiculo({ ...this.variaveisProcesso.dadosVeiculo })
        );
        console.log('2 - Resposta da integração: ', response);
        this.notification.formSucess('Integrado com sucesso.');
        return { formData: this.montaFormData(step.nextAction.name) };
      } catch (err) {
        console.error('Erro ao integrar os dados: ', err);
        this.notification.requestError('Erro ao integrar os dados. Verifique!');
        this.wfService.abortSubmit();
        return undefined;
      } finally {
        console.log('3 - Finalizando processo de integração', step.nextAction.name);
        this.componenteLoadingService.finalizarLoadingDinamico();
      }

    }

    return {
      formData: this.montaFormData(step.nextAction.name)
    };
  }
  
  async ngOnInit(): Promise<void> {
    this.wfService.onSubmit(this.enviarFormulario.bind(this));

    this.componenteLoadingService.iniciarLoadingDinamico();
  }

  ngAfterViewInit(): void {

    this.inicializarFormulario();

  } 
}
