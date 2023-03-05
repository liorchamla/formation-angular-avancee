import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">NgCRM</a>
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
          <ul class="navbar-nav me-auto">
            <ng-container *authenticated="true">
              <li class="nav-item">
                <a class="nav-link" routerLink="/invoices">Factures</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/invoices/create">+ Créer</a>
              </li>
            </ng-container>
          </ul>
          <ul class="navbar-nav">
            <ng-container *authenticated="false">
              <li class="nav-item">
                <a
                  id="login"
                  routerLink="/account/login"
                  class="btn btn-success btn-sm"
                  >Connexion</a
                >
              </li>
              <li class="nav-item">
                <a
                  id="register"
                  routerLink="/account/register"
                  class="btn btn-info btn-sm"
                  >Inscription</a
                >
              </li>
            </ng-container>
            <li class="nav-item" *authenticated="true">
              <button
                (click)="onLogout()"
                id="logout"
                class="btn btn-danger btn-sm"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container pt-5">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/account/login');
  }

  constructor(private auth: AuthService, private router: Router) {}
}
