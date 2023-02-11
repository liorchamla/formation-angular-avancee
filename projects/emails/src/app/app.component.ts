import { Component } from '@angular/core';

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
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLinkActive="active" routerLink="/emails"
                >Mes messages
              </a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
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
export class AppComponent {}
