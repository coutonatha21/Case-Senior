import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprovacaoComponent } from './aprovacao.component';

const routes: Routes = [
  { path: '', component: AprovacaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprovacaoRoutingModule { }
