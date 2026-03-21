import { Injectable } from '@angular/core';
import {
  WfFormData,
  WfPlatformData,
  WfProcessError,
  WfProcessStep,
  WfVariable,
  WorkflowCockpit,
  workflowCockpit,
} from './workflow-cockpit';
import { WfUser } from './model/user';
import { VariaveisProcessoDTO } from '../../../shared/models/variaveis-processo.model';
import { DadosSolicitante, DadosSolicitanteDTO } from '../../../shared/models/colaboradores.model';
import { DadosVeiculo, DadosVeiculosDTO, Observacao, ObservacaoDTO } from '../../../shared/models/veiculo.model';

type ErrorFunction = (
  proccessStep: WfProcessError,
  workflow: WorkflowCockpit
) => void;

type SubmitFunction = (
  proccessStep: WfProcessStep,
  workflow: WorkflowCockpit
) => Promise<WfFormData | undefined> | WfFormData | undefined ;

type ProccessVariables = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private static readonly EMPTY_PLATFORM_DATA: WfPlatformData = {
    odataUrl: '',
    serviceUrl: '',
    token: {
      access_token: '', 
      token_type: ''
    },
  };

  private workflow!: WorkflowCockpit;
  private errorFunction!: ErrorFunction;
  private submitFunction!: SubmitFunction;

  constructor() {
    this.workflow = workflowCockpit({
      init: (_, workflow) => {
        this.workflow = workflow;
      },
      onSubmit: (processStep, workflow) => {
        this.workflow = workflow;
        if (this.submitFunction) {
          return this.submitFunction(processStep, workflow);
        }
        return {};
      },
      onError: (processError, workflow) => {
        this.workflow = workflow;
        if (this.errorFunction) {
          this.errorFunction(processError, workflow);
        }
      },
    });
  }

  public onError(fn: ErrorFunction): void {
    this.errorFunction = fn;
  }

  public onSubmit(fn: SubmitFunction): void {
    this.submitFunction = fn;
  }

  /**
   * @description aborta a ação de submit. Este método pode ser utilizado para cancelar a ação de subimit
   * caso o formulário seja inválido.
   */
  public abortSubmit(): void {
    throw new Error('Ação cancelada.');
  }

  public requestPlatformDataAndVariables(): Promise<
    WfPlatformData & ProccessVariables
  > {
    return Promise.all([
      this.requestPlatformData(),
      this.requestProcessVariables(),
    ]).then((results) => {
      const allPromiseResults = results.reduce(
        (previousValue, currentValue) =>
          Object.assign(previousValue, currentValue),
        {}
      );
      return allPromiseResults as WfPlatformData & ProccessVariables;
    });
  }

  public requestPlatformData(): Promise<WfPlatformData> {
    return this.workflow
      .getPlatformData()
      .then((platform) => platform || WorkflowService.EMPTY_PLATFORM_DATA);
  }

  public requestUserData(): Promise<WfUser> {
    return this.workflow.getUserData().then((data) => {
      if (data) {
        const userData: WfUser = Object.assign(new WfUser(), data);

        if (userData.username.indexOf('@') >= 0) {
          userData.username = userData.username.split('@')[0];
        }

        return userData;
      } else {
        return new WfUser();
      }
    });
  }

  public requestProcessVariables(): Promise<VariaveisProcessoDTO | ProccessVariables> {
    return this.workflow.getInfoFromProcessVariables().then((wfVariables) => {
      if (wfVariables) {
        return this.parsePendencyData(wfVariables);
      } else {
        return {};
      }
    });
  }

  public async requestTypedProcessVariables(): Promise<VariaveisProcessoDTO> {
    const variables = (await this.requestProcessVariables()) as Record<string, unknown>;

    return {
      dadosSolicitante: this.parseProcessVariable<DadosSolicitanteDTO>(variables['dadosSolicitante'], new DadosSolicitante()),
      dadosVeiculo: this.parseProcessVariable<DadosVeiculosDTO>(variables['dadosVeiculo'], new DadosVeiculo()),
      observacao: this.parseProcessVariable<ObservacaoDTO>(variables['observacao'], new Observacao())
    };
  }

  public getToken(bearer = true): string {
    const TOKEN = sessionStorage.getItem('senior-token') || '';
    return bearer ? `Bearer ${TOKEN}` : TOKEN;
  }

  public getUser(): WfUser {
    return JSON.parse(sessionStorage.getItem('userData') || '{}') as WfUser;
  }

  private parseProcessVariable<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    if (typeof value === 'object') {
      return value as T;
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }

    return fallback;
  }

  private parsePendencyData(pendencyData: WfVariable[]): VariaveisProcessoDTO {
    const data: Record<string, any> = {};
    for (const pendency of pendencyData) {
      const attr = pendency;
      if (['Integer', 'Double', 'Float'].includes(attr.type)) {
        data[attr.key] = parseFloat(attr.value);
      } else if (attr.type === 'Date') {
        data[attr.key] = attr.value && attr.value.length > 0 ? new Date(attr.value) : '';
      } else if(attr.type === 'Boolean' || attr.key.toLowerCase().indexOf('json') >=0 ) {
        data[attr.key] = JSON.parse(attr.value);
      } else {
        try {
          data[attr.key] = JSON.parse(attr.value)
        } catch (error) {
          data[attr.key] = attr.value;
        }
      }
    }
    return data as VariaveisProcessoDTO;
  }
}
