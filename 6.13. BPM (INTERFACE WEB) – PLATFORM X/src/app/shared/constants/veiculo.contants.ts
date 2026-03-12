// src/app/shared/constants/veiculo.constants.ts
import { SelectConfig } from '../components/select/select.model';

export const CORES_CONFIG: SelectConfig = {
  label: 'Cor',
  placeholder: 'Selecione a cor',
  options: [
    { label: 'BRANCO', value: 'BRANCO' },
    { label: 'PRETO', value: 'PRETO' },
    { label: 'CINZA', value: 'CINZA' },
    { label: 'PRATA', value: 'PRATA' },
    { label: 'VERMELHO', value: 'VERMELHO' },
    { label: 'AZUL', value: 'AZUL' },
  ],
  optionLabel: 'label',
  optionValue: 'value'
};