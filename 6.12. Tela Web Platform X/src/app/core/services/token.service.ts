import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, fromEvent, map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token$ = new BehaviorSubject <Token | undefined> (undefined);

  public obterToken(): Observable<Token>{
    return this.token$.pipe(
      switchMap((token) => {
        return token !== undefined
        ? of(token)
        : fromEvent<MessageEvent>(window, "message").pipe(
          map((evento) => this.extrairToken(evento)),
          filter((tokenExtraido): tokenExtraido is Token => tokenExtraido !== undefined),
          tap((novoToken) => {
            this.token$.next(novoToken);
          })
        )
      })
    )
  }

  private extrairToken(evento: MessageEvent): Token | undefined {
    const data = evento?.data as {
      token?: { access_token?: string; token_type?: string };
    };

    const accessToken = data?.token?.access_token;
    const tokenType = data?.token?.token_type;

    return accessToken && tokenType
      ? { accessToken, tokenType }
      : undefined;
  }
}

export interface Token{
  accessToken: string;
  tokenType: string;
}