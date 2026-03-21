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
    path: 'aprovacao',
    loadChildren: () =>
      import('./modules/aprovacao/aprovacao.module').then(
        (m) => m.AprovacaoModule
      ),
  },
  {
    path: 'revisao',
    loadChildren: () =>
      import('./modules/revisao/revisao.module').then(
        (m) => m.RevisaoModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
