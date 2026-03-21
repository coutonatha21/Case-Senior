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
  styleUrls: ['./pagina-inicial.component.css'],
})
export class PaginaInicialComponent implements OnInit {
  private EstacionamentosService = inject(EstacionamentosService);

  protected informacoesEstacionamentos = signal<Estacionamentos | undefined>(
    undefined,
  );
  protected carregandoInformacoes = signal(false);

  ngOnInit(): void {
    console.log('Obtendo informações dos estacionamentos...');  
    this.carregandoInformacoes.set(true);
    this.EstacionamentosService.obterEstacionamentos('R')
      .pipe(
        finalize(() => {
          this.carregandoInformacoes.set(false);
        }),
      )
      .subscribe({
        next: (infoEstacionamentos) => {
          console.log('Informações dos estacionamentos obtidas:', infoEstacionamentos);
          this.informacoesEstacionamentos.set(infoEstacionamentos);
        },
        error: (erro) => {
          console.error('Falha ao obter informações dos estacionamentos:', erro);
        },
      });
  }
}
