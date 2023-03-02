import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">NgMails</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav me-auto" *ngIf="authStatus$ | async">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLinkActive="active"
                routerLink="/messages"
                >Mes messages
              </a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <ng-container *ngIf="!(authStatus$ | async)">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLinkActive="active"
                  routerLink="/account/login"
                  >Connexion</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLinkActive="active"
                  routerLink="/account/register"
                  >Inscription</a
                >
              </li>
            </ng-container>
            <li class="nav-item" *ngIf="authStatus$ | async">
              <button class="btn btn-sm btn-danger" (click)="onLogout()">
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div style="position: relative">
      <app-loading-bar></app-loading-bar>
    </div>
    <div class="container pt-5">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  authStatus$?: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authStatus$ = this.authService.authStatus$;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/account/login');
  }
}
