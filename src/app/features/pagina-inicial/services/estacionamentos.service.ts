import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Estacionamentos } from '../models/estacionamentos.model';

@Injectable({
  providedIn: 'root',
})
export class EstacionamentosService {
  private readonly basePayload = {
    id: 'b0d5b4d8-a857-4261-bb7e-efa6342296e1',
    inputData: {
      module: 'rubi',
      server: `http://${environment.server.acces}:8080`,
      port: 'Estacionamentos',
      service: 'case.senior.GestaoEstacionamento',
      encryption: '3',
      user: '',
      password: '',
      rootObject: '',
    },
  };

  private http = inject(HttpClient);

  public obterEstacionamentos(): Observable<Estacionamentos> {
    return this.http.post<Estacionamentos>(environment.plugin.invoke, {
      ...this.basePayload,
      inputData: {
        ...this.basePayload.inputData,
      },
    });
  }
}
