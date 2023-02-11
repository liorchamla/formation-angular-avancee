import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  template: `
    <h1>Inscription</h1>
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
      <div class="form-group mb-2">
        <input
          type="password"
          placeholder="Confirmation de mot de passe"
          class="form-control"
        />
      </div>
      <button class="btn btn-success">Inscription</button>
    </form>
  `,
  styles: [],
})
export class RegisterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
