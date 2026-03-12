import { Component} from '@angular/core';
import { CampoModel } from '@senior-hcm-service-tower/hst-dados/model/campo.model';
import { ComponentModel } from '../component.model';
import { SelectConfig } from '../select/select.model';
import { NotificationService } from '@services/utils/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { montaCamposVeiculo } from 'src/app/utils/factories/campos-veiculo.factory';
import { DadosVeiculo } from 'src/app/shared/models/veiculo.model';
import { CORES_CONFIG } from '../../constants/veiculo.contants';

@Component({
  selector: 'app-dados-veiculo',
  templateUrl: './dados-veiculo.component.html',
  styleUrl: './dados-veiculo.component.scss'
})
export class DadosVeiculoComponent implements ComponentModel {
  camposVeiculo: CampoModel[] = []
  formulario!: FormGroup; 

  coresConfig: SelectConfig = CORES_CONFIG;

  errorsMessage = {
    required: 'Campo obrigatório!'
  };

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.formulario = this.fb.group({
      PlaVei: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)]],
      ModVei: ['', [Validators.required]],
      CorVei: [null, [Validators.required]],
      AnoVei: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
    })
    this.camposVeiculo = montaCamposVeiculo(this.formulario.getRawValue());

  }
  
  inicializarComponente(...args: any[]): void {}

  preencherFormulario(dados: DadosVeiculo){
    // Encontrar o objeto completo da cor
    const corSelecionada = this.coresConfig.options.find(
      option => option.value === dados.CorVei
    );

    this.retornaValores();

    // Preencher com objetos, não strings
    this.formulario.patchValue({
      PlaVei: dados.PlaVei?.toUpperCase() || '',
      ModVei: dados.ModVei?.toUpperCase() || '',
      CorVei: corSelecionada,
      AnoVei: dados.AnoVei
    });

    this.camposVeiculo = montaCamposVeiculo(dados);
  }

  retornaValores() {
    return this.formulario.value;
  }

  formularioValido(): boolean {
    Object.values(this.formulario.controls).forEach(control => {
      //control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    return this.formulario.valid;
  }

  limparValidadores(): void {
    Object.values(this.formulario.controls).forEach(control => control.clearValidators());
  }
  setarValidadores(): void {
    Object.values(this.formulario.controls).forEach(control => {
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    });
  }
  desabilitarCampos(): void {
    Object.values(this.formulario.controls).forEach(control => {
      control.disable();
    });
  }

  habilitarCampos(): void {
    Object.values(this.formulario.controls).forEach(control => {
      control.enable();
    });
  }
}