import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AprovacaoComponent } from './aprovacao.component';
import { AprovacaoRoutingModule } from './aprovacao-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AprovacaoComponent
  ],
  imports: [
    CommonModule,
    AprovacaoRoutingModule,
    SharedModule
  ],
  exports: [
    AprovacaoComponent
  ]
})
export class AprovacaoModule { }
