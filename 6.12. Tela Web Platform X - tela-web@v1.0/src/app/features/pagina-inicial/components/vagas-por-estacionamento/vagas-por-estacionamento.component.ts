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
  ],
  templateUrl: './vagas-por-estacionamento.component.html',
  styleUrl: './vagas-por-estacionamento.component.css',
})
export class vagasPorEstacionamento {
  public InformacoesEstacionamentos = input<Estacionamentos | undefined>(
    undefined,
  );

  protected estacionamentoSelecionado?: Estacionamento;
  protected estacionamentosFiltrados: Estacionamento[] = [];
  private vagasService = inject(VagasService);

  protected vehicles: any[] = [];
  protected carregandoVagas = signal(false);
  protected tipOpe = 'R';

  filtrarEstacionamentos(event: { query: string }) {
    const todos = this.InformacoesEstacionamentos()?.outputData?.retEst ?? [];
    const query = (event.query ?? '').toLowerCase();

    this.estacionamentosFiltrados = todos.filter((e) =>
      (e.desEst ?? '').toLowerCase().includes(query),
    );
  }

  onEstacionamentoSelect(estacionamento: Estacionamento) {
    this.estacionamentoSelecionado = estacionamento;
    this.carregandoVagas.set(true);

    this.vagasService
      .obterVagas(this.tipOpe, estacionamento.codEst ?? '')
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

          // Processa os veículos
          let retVei = estacionamentoResposta.retVei;
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

          // Calcula vagas livres
          const vagasDisponiveis = Number(estacionamentoResposta.vagDis || 0);

          const vagasLivres = Array.from({ length: vagasDisponiveis }).map(
            (_, index) => ({
              id: undefined,
              owner: 'Livre',
              model: undefined,
              plate: undefined,
              year: undefined,
              color: undefined,
            }),
          );

          this.vehicles = [...vagasPreenchidas, ...vagasLivres];
          this.carregandoVagas.set(false);
        },
        error: () => {
          this.carregandoVagas.set(false);
        },
      });
  }
}
