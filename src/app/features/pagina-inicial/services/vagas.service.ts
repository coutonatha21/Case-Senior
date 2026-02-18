import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Vagas } from '../models/vagas.model';

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private readonly basePayload = {
    id: 'b0d5b4d8-a857-4261-bb7e-efa6342296e1',
    inputData: {
      module: 'rubi',
      server: 'http://ec2-54-175-124-51.compute-1.amazonaws.com:8080',
      port: 'Vagas',
      service: 'case.senior.GestaoEstacionamento',
      encryption: '3',
      user: '',
      password: '',
      rootObject: '',
    },
  };

  private http = inject(HttpClient);

  public obterVagas(CodEst: string): Observable<Vagas> {
    console.log(this.basePayload.inputData, CodEst);
    return this.http.post<Vagas>(environment.plugin.invoke, {
      ...this.basePayload,
      inputData: {
        ...this.basePayload.inputData,
        CodEst,
      },
    });
  }
}