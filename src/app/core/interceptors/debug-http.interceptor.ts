import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const debugHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const start = performance.now();

  console.log('➡️ HTTP OUT', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers,
  });

  return next(req).pipe(
    tap({
      next: (event) => {
        console.log('✅ HTTP EVENT', event);
      },
      error: (err) => {
        const ms = Math.round(performance.now() - start);
        console.error(`❌ HTTP ERROR after ${ms}ms`, err);
      },
      complete: () => {
        const ms = Math.round(performance.now() - start);
        console.log(`🏁 HTTP COMPLETE in ${ms}ms`);
      },
    }),
  );
};
