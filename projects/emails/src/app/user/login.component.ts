import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <h1>Connexion</h1>
    <form>
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
  constructor() {}

  ngOnInit(): void {}
}
