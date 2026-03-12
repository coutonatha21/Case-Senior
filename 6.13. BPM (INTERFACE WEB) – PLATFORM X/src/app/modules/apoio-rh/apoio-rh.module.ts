import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApoioRhRoutingModule } from './apoio-rh-routing.module';
import { ApoioRhComponent } from './apoio-rh.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ApoioRhComponent
  ],
  imports: [
    CommonModule,
    ApoioRhRoutingModule,
    SharedModule
  ],
  exports: [
    ApoioRhComponent
  ]
})
export class ApoioRhModule { }
