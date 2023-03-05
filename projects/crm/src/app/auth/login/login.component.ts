import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../auth.service';

// Afin d'alléger le code du composant, on peut extraire de la classe Validators
// les fonctions dont on a besoin pour la validation de ce formulaire
const { required, email, minLength, pattern } = Validators;

// On peut définir un type pour le formulaire afin de bénéficier de la
// complétion de code et de la vérification des types
export type LoginFormType = FormGroup<{
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}>;

@Component({
  selector: 'app-login',
  template: `
    <div class="bg-light rounded p-3">
      <h1>Connexion à NgCRM !</h1>
      <form [formGroup]="loginForm" (submit)="onSubmit()">
        <div class="alert bg-warning text-white" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div>
          <label class="mb-1" for="email">Adresse email</label>
          <input
            type="email"
            placeholder="Adresse email de connexion"
            name="email"
            formControlName="email"
            [class.is-invalid]="email.touched && email.invalid"
            id="email"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">L'adresse email doit être valide</p>
        </div>
        <div>
          <label class="mb-1" for="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Votre mot de passe"
            name="password"
            formControlName="password"
            [class.is-invalid]="password.touched && password.invalid"
            id="password"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            Le mot de passe est obligatoire, doit faire 5 caractères minimum et
            contenir au moins un chiffre
          </p>
        </div>

        <button class="btn btn-success">Connexion !</button>
      </form>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  errorMessage = '';

  loginForm: LoginFormType = this.fb.group({
    email: ['lior@mail.com', [required, email]],
    password: ['passw0rd', [required, minLength(5), pattern(/\d+/)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginData = {
      email: this.email.value!,
      password: this.password.value!,
    };

    this.auth.login(loginData).subscribe({
      next: () => this.router.navigate(['/']),
      // Attention : ici on peut avoir une erreur renvoyée par l'API (Invalid Credential par exemple)
      // Mais on peut aussi avoir une erreur due à une déconnexion ou un soucis réseau etc
      // Dans un cas, on a une HttpErrorResponse, dans l'autre une ErrorEvent et on ne le traite pas pareil
      error: (httpError) =>
        (this.errorMessage =
          httpError.error.message ??
          'Une erreur est survenue, veuillez réessayer plus tard'),
    });
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}
