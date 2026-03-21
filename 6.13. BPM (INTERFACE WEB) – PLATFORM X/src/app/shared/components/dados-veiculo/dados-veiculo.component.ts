import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/utils/notification.service';
import { DadosVeiculosDTO } from '../../models/veiculo.model';
import { CampoModel } from '@senior-hcm-service-tower/hst-dados/model/campo.model';
import { montaCamposVeiculo } from 'src/app/utils/factories/campos-veiculo.factory';

@Component({
  selector: 'app-dados-veiculo',
  templateUrl: './dados-veiculo.component.html',
  styleUrl: './dados-veiculo.component.scss',
})
export class DadosVeiculoComponent {
  formulario!: FormGroup;
  camposVeiculo: CampoModel[] = [];

  private readonly mercosulPlateRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  private readonly yearRegex = /^[0-9]{4}$/;
  readonly opcoesCor = [
    { label: 'Branco', value: 'Branco' },
    { label: 'Preto', value: 'Preto' },
    { label: 'Cinza', value: 'Cinza' },
    { label: 'Prata', value: 'Prata' },
    { label: 'Azul', value: 'Azul' },
    { label: 'Vermelho', value: 'Vermelho' },
    { label: 'Verde', value: 'Verde' },
    { label: 'Amarelo', value: 'Amarelo' },
  ];

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
  ) {
    this.formulario = this.fb.group({
      PlaVei: [
        '',
        [Validators.required, Validators.pattern(this.mercosulPlateRegex)],
      ],
      ModVei: ['', Validators.required],
      CorVei: [null, Validators.required],
      AnoVei: ['', [Validators.required, Validators.pattern(this.yearRegex)]],
    });

    this.formulario.get('PlaVei')?.valueChanges.subscribe((value) => {
      if (typeof value !== 'string') {
        return;
      }

      const normalized = value.toUpperCase();
      if (normalized !== value) {
        this.formulario
          .get('PlaVei')
          ?.setValue(normalized, { emitEvent: false });
      }
    });
  }

  retornaValores(): DadosVeiculosDTO {
    return this.formulario.getRawValue();
  }

  get corControl() {
    return this.formulario.get('CorVei');
  }

  isCorInvalida(): boolean {
    const control = this.corControl;
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  isSomenteLeitura(): boolean {
    return this.formulario.disabled;
  }

  formularioValido(): boolean {
    for (const campo in this.formulario.controls) {
      this.formulario.get(campo)?.markAsDirty();
      this.formulario.get(campo)?.updateValueAndValidity();
    }

    if (this.formulario.invalid && this.formulario.enabled) {
      if (this.formulario.get('PlaVei')?.hasError('pattern')) {
        this.notification.formError(
          'A placa deve seguir o padrao Mercosul (ex: ABC1D23).',
        );
        return false;
      }

      if (this.formulario.get('AnoVei')?.hasError('pattern')) {
        this.notification.formError(
          'O ano deve conter exatamente 4 digitos numericos.',
        );
        return false;
      }

      this.notification.formError(
        'Preencha os dados do veiculo para continuar.',
      );
      return false;
    }

    return true;
  }

  preencherFormulario(dados: DadosVeiculosDTO) {
    this.formulario.patchValue(dados);
    this.camposVeiculo = montaCamposVeiculo(dados);
  }
  limparValidadores(): void {
    Object.values(this.formulario.controls).forEach((control) =>
      control.clearValidators(),
    );
  }
  desabilitarCampos(): void {
    Object.values(this.formulario.controls).forEach((control) => {
      control.disable();
    });
  }
}
