import {
  parse,
  isValid,
  lightFormat,
  intervalToDuration,
  Duration,
  Interval,
  startOfDay,
} from 'date-fns';
export class DateUtils {
  FORMATO_DATA_BRASIL = 'dd/MM/yyyy';
  FORMATO_DATA_ISO = 'yyyy-MM-dd';
  FORMATO_HORAS_MINUTOS = 'HH:mm';
  DATA_ZERO_G5 = new Date(1900, 11, 31, 0, 0, 0, 0);
  DATA_MAXIMA_G5 = new Date(2079, 11, 31, 0, 0, 0, 0);

  parseDataG5(dataG5: string): Date | null  {
    const dataParseada = parse(dataG5, this.FORMATO_DATA_BRASIL, new Date());
    const dataValida = isValid(dataParseada);
    return dataValida ? dataParseada : null;
  };

  parseDataPlataforma(data: string): Date | null {
    const dataParseada = parse(data, this.FORMATO_DATA_ISO, new Date());
    const dataValida = isValid(dataParseada);
    return dataValida ? dataParseada : null;
  };

  dataHoraParaMinutos(data: Date): number | null {
    const dataValida = isValid(data);
    return dataValida ? data.getHours() * 60 + data.getMinutes() : null;
  };

  minutosParaDataHora(minutos = 0): Date {
    const minutes = minutos % 60;
    const hours = Math.floor(minutos / 60);
    const dataEHora = new Date();
    dataEHora.setHours(hours, minutes, 0, 0);
    return dataEHora;
  };

  formataDataG5(data: Date): string | null {
    return isValid(data) ? lightFormat(data, this.FORMATO_DATA_BRASIL) : null;
  };

  formataDataPlataforma(data: Date): string | null {
    return isValid(data) ? lightFormat(data, this.FORMATO_DATA_ISO) : null;
  };

  formataMinutosParaHorasMinutos(minutos = 0): string {
    const minutes = minutos % 60;
    const hours = Math.floor(minutos / 60);
    return `${this.completar2Digitos(hours)}:${this.completar2Digitos(minutes)}`;
  };

  formataDataParaHorasMinutos(data: Date): string | null {
    return isValid(data) ? lightFormat(data, this.FORMATO_HORAS_MINUTOS) : null;
  };

  parseListaDataG5(dataG5: string[]): Date[] {
    return dataG5
      .map((dataString) => this.parseDataG5(dataString))
      .filter((data) => data != null) as Date[];
  };

  intervaloAteHoje(data: Date): Duration {
    const dataValida = isValid(data);

    if (dataValida) {
      const dataHoje = startOfDay(new Date());
      const intervalo: Interval = { start: dataHoje, end: data };
      return intervalToDuration(intervalo);
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      months: 0,
      seconds: 0,
      weeks: 0,
      years: 0,
    };
  };

  completar2Digitos(num: number): string {
    return num.toString().padStart(2, '0');
  };

  dataParaTexto(data: string | Date): string | null{
    if(typeof(data) != "string"){
      return this.formataDataG5(data)
    }else{
      return data
    }
  }

  textoParaData(data: string | Date): Date | null{
    if(typeof(data) == "string"){
      return this.parseDataPlataforma(data)
    }else{
      return data
    }
  }

  yyyy_mm_ddThh_mm_ss_z__dd_mm_yyyy(input: string | Date): string{
    const date = typeof input === 'string' ? new Date(input) : input;
    const formattedDate = date.getUTCDate().toString().padStart(2, '0') + '/' +
                      (date.getUTCMonth() + 1).toString().padStart(2, '0') + '/' +
                      date.getUTCFullYear();
    return formattedDate;
  }
  
}

