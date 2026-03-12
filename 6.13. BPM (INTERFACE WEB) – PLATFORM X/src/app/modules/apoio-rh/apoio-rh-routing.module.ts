import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApoioRhComponent } from './apoio-rh.component';

const routes: Routes = [
  {
    path: '',
    component: ApoioRhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApoioRhRoutingModule {}
