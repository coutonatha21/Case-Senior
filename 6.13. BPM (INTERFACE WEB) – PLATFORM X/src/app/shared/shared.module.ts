import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';

import { InputComponent } from '@senior-hcm-service-tower/hst-input';
import { DadosSolicitanteComponent } from './components/dados-solicitante/dados-solicitante.component';
import { CardComponent } from '@senior-hcm-service-tower/hst-card';
import { LookupComponent } from '@senior-hcm-service-tower/hst-lookup';
import { DadosComponent } from '@senior-hcm-service-tower/hst-dados';
import { UploadFilesComponent } from '@senior-hcm-service-tower/hst-upload-files';
import { MessageComponent } from '@senior-hcm-service-tower/hst-message';
import { SelectComponent } from './components/select/select.component';
import { ObservacaoComponent } from './components/observacao/observacao.component';
import { BlockInteractionDirective } from '../utils/directives/bloqueia-interacao.directive';
import { DadosVeiculoComponent } from './components/dados-veiculo/dados-veiculo.component';

const NG_COMPONENTS = [
  ButtonModule,
  AvatarModule,
  PanelModule,
  FieldsetModule,
  InplaceModule,
  InputTextModule,
  InputIconModule,
  IconFieldModule,
  DropdownModule,
  CardModule,
  DividerModule,
  CalendarModule,
  InputTextareaModule,
  CheckboxModule,
  RadioButtonModule,
  DialogModule,
  TableModule,
  InputGroupModule,
  InputGroupAddonModule,
  BadgeModule,
  TagModule,
  InputComponent,
  MessageComponent,
  UploadFilesComponent,
  DadosComponent,
  LookupComponent,
  CardComponent
];

const CUSTOM_COMPONENTS = [
  DadosSolicitanteComponent,
  ObservacaoComponent,
  SelectComponent,
  DadosVeiculoComponent
  // -- Adicionar componentes criados no shared
]

const DIRECTIVES = [
  BlockInteractionDirective
]

@NgModule({
  declarations: [
    ...CUSTOM_COMPONENTS,
    ...DIRECTIVES,
    DadosVeiculoComponent
  ],
  imports: [
    CommonModule,
    ...NG_COMPONENTS,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ...NG_COMPONENTS,
    ReactiveFormsModule,
    FormsModule,
    ...CUSTOM_COMPONENTS,
    ...DIRECTIVES
  ]
  })
export class SharedModule { }
