import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, of, switchMap, tap } from 'rxjs';

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
        : fromEvent(window, "message").pipe(
          map<any, Token>((evento) => {
            return{
              accessToken: evento.data.token.access_token,
              tokenType: evento.data.token.token_type,
            }
          }),
          tap((novoToken) => {
            this.token$.next(novoToken);
          })
        )
      })
    )
  }
}

export interface Token{
  accessToken: string;
  tokenType: string;
}