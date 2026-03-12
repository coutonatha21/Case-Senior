export interface SelectConfig {
  options: {label: string, value: any, disabled?:boolean}[];
  optionLabel: string;
  optionValue: string;
  label: string;
  placeholder?: string;
}