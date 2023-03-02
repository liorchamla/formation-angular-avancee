import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h1>Connexion</h1>
    <form (submit)="onSubmit()">
      <div class="form-group mb-2">
        <input
          type="email"
          placeholder="Votre adresse email"
          class="form-control"
        />
      </div>
      <div class="form-group mb-2">
        <input
          type="password"
          placeholder="Mot de passe"
          class="form-control"
        />
      </div>
      <button class="btn btn-success">Connexion</button>
    </form>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authService.login();
    this.router.navigateByUrl('/messages');
  }
}
