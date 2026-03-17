import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

import {
  Estacionamento,
  Estacionamentos,
} from '../../models/estacionamentos.model';
import { VagasService } from '../../services/vagas.service';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-vagas-por-estacionamento',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    InputTextModule,
    FormsModule,
    AutoCompleteModule,
    LoadingComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vagas-por-estacionamento.component.html',
  styleUrl: './vagas-por-estacionamento.component.css',
})
export class vagasPorEstacionamento {
  private readonly cardColors: Record<
    string,
    { background: string; border: string }
  > = {
    branco: { background: '#ffffff', border: '#000000' },
    preto: { background: '#000000', border: '#ffffff' },
    cinza: { background: '#7f8183', border: '#000000' },
    prata: { background: '#bbbbbb', border: '#000000' },
    vermelho: { background: '#de2020', border: '#000000' },
    azul: { background: '#245fa8', border: '#000000' },
  };

  public InformacoesEstacionamentos = input<Estacionamentos | undefined>(
    undefined,
  );

  private vagasService = inject(VagasService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  protected vehicles: any[] = [];
  protected carregandoVagas = signal(false);
  protected estacionamentoBusca?: Estacionamento | string;
  protected estacionamentoSelecionado?: Estacionamento;
  protected estacionamentosFiltrados: Estacionamento[] = [];

  protected getVehicleBackgroundColor(vehicle: any): string {
    return this.getVehicleCardPalette(vehicle).background;
  }

  protected getVehicleBorderColor(vehicle: any): string {
    return this.getVehicleCardPalette(vehicle).border;
  }

  filtrarEstacionamentos(event: { query: string }) {
    const todos = this.InformacoesEstacionamentos()?.outputData?.retEst ?? [];
    const query = (event.query ?? '').toLowerCase();

    this.estacionamentosFiltrados = todos.filter((e) =>
      (e.desEst ?? '').toLowerCase().includes(query),
    );
  }

  limparFiltro() {
    this.estacionamentoBusca = undefined;
    this.estacionamentoSelecionado = undefined;
    this.vehicles = [];
  }

  onEstacionamentoChange(value: Estacionamento | string | undefined) {
    this.estacionamentoBusca = value;

    if (!this.isEstacionamentoValido(value)) {
      this.estacionamentoSelecionado = undefined;
      this.vehicles = [];
      return;
    }

    this.estacionamentoSelecionado = value;
  }

  confirmarExclusao(vehicle: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o veículo ${vehicle.model} do estacionamento ${this.estacionamentoSelecionado?.codEst} - ${this.estacionamentoSelecionado?.desEst}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.excluirVeiculo(vehicle),
    });
  }

  excluirVeiculo(vehicle: any) {
    console.log('Excluindo veículo:', vehicle);
    const mensagemSucesso = 'Registro deletado com sucesso!';

    this.vagasService
      .manipularVagas(
        'D',
        this.estacionamentoSelecionado?.codEst ?? '',
        vehicle.plate ?? '',
      )
      .subscribe({
        next: (response) => {
          const retMsg = response?.outputData?.retMsg ?? '';
          const retVagRaw = response?.outputData?.retVag;

          const retVagArr = Array.isArray(retVagRaw)
            ? retVagRaw
            : retVagRaw
              ? [retVagRaw]
              : [];

          const estacionamentoRetorno = retVagArr.find(
            (est: any) =>
              Number(est.codEst) ===
              Number(this.estacionamentoSelecionado?.codEst ?? 0),
          );

          if (estacionamentoRetorno) {
            this.aplicarRetornoEstacionamento(estacionamentoRetorno);
          }

          if (retMsg === mensagemSucesso) {
            this.messageService.add({
              severity: 'success',
              summary: 'Veículo excluído',
              detail: `O veículo ${vehicle.model} foi excluído do estacionamento ${this.estacionamentoSelecionado?.codEst} - ${this.estacionamentoSelecionado?.desEst}.`,
              life: 6000,
            });

            if (this.estacionamentoSelecionado) {
              this.onEstacionamentoSelect(this.estacionamentoSelecionado);
            }
            return;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Exclusão não confirmada',
            detail:
              retMsg || 'A API retornou 200, mas não confirmou a exclusão.',
            life: 6000,
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao excluir veículo',
            detail: `Ocorreu um erro ao tentar excluir o veículo ${vehicle.model} do estacionamento ${this.estacionamentoSelecionado?.codEst} - ${this.estacionamentoSelecionado?.desEst}.`,
            life: 6000,
          });
        },
      });
  }

  onEstacionamentoSelect(estacionamento: Estacionamento) {
    this.estacionamentoBusca = estacionamento;
    this.estacionamentoSelecionado = estacionamento;
    this.carregandoVagas.set(true);

    this.vagasService
      .manipularVagas('R', estacionamento.codEst ?? '', '')
      .subscribe({
        next: (response) => {
          const retVagRaw = response?.outputData?.retVag;

          const retVagArr = Array.isArray(retVagRaw)
            ? retVagRaw
            : retVagRaw
              ? [retVagRaw]
              : [];

          const estacionamentoResposta = retVagArr.find(
            (est: any) => Number(est.codEst) === Number(estacionamento.codEst),
          );

          if (!estacionamentoResposta) {
            this.vehicles = [];
            this.carregandoVagas.set(false);
            return;
          }

          this.aplicarRetornoEstacionamento(estacionamentoResposta);
          this.carregandoVagas.set(false);

          if (Number(estacionamentoResposta.vagDis) === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Estacionamento lotado',
              detail: `Todas as vagas do estacionamento ${estacionamento.codEst} - ${estacionamento.desEst} estão preenchidas!`,
              life: 6000,
            });
          }
        },
        error: () => {
          this.carregandoVagas.set(false);
        },
      });
  }

  private aplicarRetornoEstacionamento(estacionamentoResposta: any): void {
    let retVei = estacionamentoResposta?.retVei;

    if (retVei && !Array.isArray(retVei)) {
      retVei = [retVei];
    } else if (!retVei) {
      retVei = [];
    }

    const vagasPreenchidas = (retVei as any[]).map((veiculo) => ({
      id: Number(veiculo.numCad),
      owner: veiculo.nomFun,
      model: veiculo.modVei,
      plate: veiculo.plaVei,
      year: veiculo.anoVei,
      color: veiculo.corVei,
    }));

    const vagasDisponiveis = Number(estacionamentoResposta?.vagDis || 0);

    const vagasLivres = Array.from({ length: vagasDisponiveis }).map(() => ({
      id: undefined,
      owner: 'Livre',
      model: undefined,
      plate: undefined,
      year: undefined,
      color: undefined,
    }));

    this.vehicles = [...vagasPreenchidas, ...vagasLivres];

    if (this.estacionamentoSelecionado) {
      this.estacionamentoSelecionado = {
        ...this.estacionamentoSelecionado,
        qtdVag: String(
          estacionamentoResposta?.totVag ??
            estacionamentoResposta?.qtdVag ??
            this.estacionamentoSelecionado.qtdVag,
        ),
        vagDis: String(
          estacionamentoResposta?.vagDis ?? this.estacionamentoSelecionado.vagDis,
        ),
        vagOcu: String(
          estacionamentoResposta?.vagOcu ?? this.estacionamentoSelecionado.vagOcu,
        ),
      };
    }
  }

  protected possuiEstacionamentoSelecionadoValido(): boolean {
    return this.isEstacionamentoValido(this.estacionamentoSelecionado);
  }

  private getVehicleCardPalette(vehicle: any): {
    background: string;
    border: string;
  } {
    if (vehicle?.owner === 'Livre') {
      return { background: '#ffffff', border: '#26a69a' };
    }

    const colorKey = (vehicle?.color ?? '').toString().trim().toLowerCase();
    return (
      this.cardColors[colorKey] ?? {
        background: '#f9fafb',
        border: '#bdbdbd',
      }
    );
  }

  private isEstacionamentoValido(
    estacionamento: Estacionamento | string | undefined,
  ): estacionamento is Estacionamento {
    return !!estacionamento && typeof estacionamento !== 'string';
  }
}