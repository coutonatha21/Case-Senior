import { Component, inject, OnInit, signal } from '@angular/core';
import { vagasPorEstacionamento } from './components/vagas-por-estacionamento/vagas-por-estacionamento.component';
import { EstacionamentosService } from './services/estacionamentos.service';
import { Estacionamentos } from './models/estacionamentos.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [vagasPorEstacionamento, LoadingComponent],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
})
export class PaginaInicialComponent implements OnInit {
  private EstacionamentosService = inject(EstacionamentosService);

  protected informacoesEstacionamentos = signal<Estacionamentos | undefined>(
    undefined,
  );
  protected carregandoInformacoes = signal(false);

  ngOnInit(): void {
    this.carregandoInformacoes.set(true);
    this.EstacionamentosService.obterEstacionamentos()
      .pipe(
        finalize(() => {
          console.log('Finalizando obtenção de informações dos estacionamentos');
          this.carregandoInformacoes.set(false);
        }),
      )
      .subscribe((infoEstacionamentos) => {
        this.informacoesEstacionamentos.set(infoEstacionamentos);
      });
  }
}
