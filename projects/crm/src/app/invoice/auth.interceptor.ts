import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

/**
 * Cet intercepteur permet, à chaque fois qu'on appelle une URL qui commence par /invoice, d'ajouter
 * automatiquement un header Authorization avec le token JWT qui provient du AuthService
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // On récupère l'URL
    const url = req.url;

    // Si l'URL ne concerne pas les Invoice, on laisse passer la requête
    if (!url.startsWith(environment.apiUrl + '/invoice')) {
      return next.handle(req);
    }

    // Sinon, il faut absolument récupérer le token
    return this.auth.authToken$.pipe(
      // Si on n'a pas de token, on lève une erreur, ce qui annulera le requête HTTP
      tap((token) => {
        if (!token) {
          throw new Error("Vous n'êtes pas authentifié !");
        }
      }),
      // Sinon, on remplace l'observable actuel (authToken$) par un nouvel observable :
      // La requête HTTP
      switchMap((token) => {
        // On clone la requête originale tout en y ajoutant le header Authorization
        const reqWithToken = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        // On laisse passer la requête modifiée
        return next.handle(reqWithToken);
      })
    );
  }
}
