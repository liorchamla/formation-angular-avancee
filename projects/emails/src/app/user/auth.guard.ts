import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // On retourne un observable qui se basera sur authStatus$ pour déterminer si l'utilisateur est connecté ou non
    return this.authService.authStatus$.pipe(
      map((status) => {
        // Si l'utilisateur est connecté, on retourne true
        if (status === true) {
          return true;
        }

        // Sinon on retourne une UrlTree qui redirigera l'utilisateur vers la page de login
        return this.router.parseUrl('/account/login');
      })
    );
  }
}
