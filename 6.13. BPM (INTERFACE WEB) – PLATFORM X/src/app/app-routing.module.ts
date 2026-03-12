import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/detalhes',
    pathMatch: 'full',
  },
  {
    path: 'solicitacao',
    loadChildren: () =>
      import('./modules/solicitacao/solicitacao.module').then(
        (m) => m.SolicitacaoModule
      ),
  },
  {
    path: 'revisao',
    loadChildren: () =>
      import('./modules/revisao/revisao.module').then(
        (m) => m.RevisaoModule
      ),
  },
  {
    path: 'apoio-rh',
    loadChildren: () =>
      import('./modules/apoio-rh/apoio-rh.module').then(
        (m) => m.ApoioRhModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
