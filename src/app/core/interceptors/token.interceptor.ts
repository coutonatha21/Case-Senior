import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { switchMap, take } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  return tokenService.obterToken().pipe(
    take(1),
    switchMap((token) => {
      req = req.clone({
        setHeaders: {
          Authorization: `${token.tokenType} ${token.accessToken}`
        }
      })
      return next(req);
    })
  )
};
