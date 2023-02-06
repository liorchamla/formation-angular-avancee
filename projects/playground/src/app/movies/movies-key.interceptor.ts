import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class MoviesKeyInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const params = 'api_key=e7358884149e833a956ccfdb6719b9ff&language=fr-FR';

    const suffix = req.url.includes('?') ? '&' : '?';

    const requestWithParams = req.clone({
      url: `${req.url}${suffix}${params}`,
    });

    return next.handle(requestWithParams);
  }
}
