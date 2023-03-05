import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth.service';

// Afin d'alléger le code du composant, on peut extraire de la classe Validators
// les fonctions dont on a besoin pour la validation de ce formulaire
const { required, email, minLength, pattern } = Validators;

// On peut définir un type pour le formulaire afin de bénéficier de la
// complétion de code et de la vérification des types
export type RegisterFormType = FormGroup<{
  email: FormControl<string | null>;
  name: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}>;

@Component({
  selector: 'app-register',
  template: `
    <div class="bg-light rounded p-3">
      <h1>Créer un compte sur NgCRM !</h1>
      <p>
        Vous pourrez alors gérer facilement vos factures en tant que Freelance !
      </p>
      <form [formGroup]="registerForm" (submit)="onSubmit()">
        <div class="alert bg-warning text-white" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div>
          <label class="mb-1" for="name">Nom d'utilisateur</label>
          <input
            type="text"
            placeholder="Votre nom d'utilisateur"
            name="name"
            formControlName="name"
            [class.is-invalid]="name.touched && name.invalid"
            id="name"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">Le nom d'utilisateur est obligatoire</p>
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
          <p class="text-info" *ngIf="email.pending">
            <span class="spinner-border spinner-border-sm"></span>
            Vérification de l'adresse email...
          </p>
          <p class="invalid-feedback" *ngIf="email.hasError('unique')">
            Cette adresse est déjà utilisée par un autre compte
          </p>
          <p
            class="invalid-feedback"
            *ngIf="email.hasError('required') || email.hasError('email')"
          >
            L'adresse email doit être valide
          </p>
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
            Le mot de passe est obligatoire, doit faire 8 caractères minimum et
            contenir au moins un chiffre
          </p>
        </div>
        <div>
          <label class="mb-1" for="confirmPassword">Confirmation</label>
          <input
            type="password"
            placeholder="Confirmez votre mot de passe"
            name="confirmPassword"
            formControlName="confirmPassword"
            [class.is-invalid]="
              confirmPassword.touched &&
              (confirmPassword.invalid || registerForm.hasError('confirm'))
            "
            id="confirmPassword"
            class="mb-3 form-control"
          />
          <p class="invalid-feedback">
            La confirmation ne correspond pas au mot de passe
          </p>
        </div>
        <button class="btn btn-success">Créer mon compte NgCRM !</button>
      </form>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  // Le message d'erreur en cas d'impossibilité de créer le compte, quelqu'en soit la raison
  // déconnexion, erreur réseau, etc.
  errorMessage = '';

  registerForm: RegisterFormType = this.fb.group(
    {
      email: [
        '',
        [required, email],
        // Ne pas oublier le .bind(this), car la fonction est ici "passée" au FormControl, et le this
        // ne sera plus celui du composant, mais celui du FormControl.
        // Grâce au bind, on peut forcer le this à être celui du composant
        this.uniqueEmailAsyncValidator.bind(this),
      ],
      name: ['', [required, minLength(5)]],
      password: ['', [required, minLength(5), pattern(/\d+/)]],
      confirmPassword: ['', required],
    },
    {
      // Dans les vidéos, j'écris ce validateur sous forme d'une fonction séparée, mais on peut aussi
      // l'écrire directement dans le FormGroup, comme ici
      validators: (form: AbstractControl) => {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password?.value !== confirmPassword?.value) {
          return { confirm: true };
        }

        return null;
      },
    }
  );

  onSubmit() {
    // Si le formulaire est invalide, on ne fait rien
    if (this.registerForm.invalid) {
      return;
    }

    // Le formulaire considère que ses données peuvent être nulles, alors qu'on sait qu'elles ne le sont pas
    // On peut donc utiliser l'opérateur ! pour dire à TypeScript que l'on est sûr que la valeur n'est pas nulle
    const registerData = {
      email: this.email.value!,
      name: this.name.value!,
      password: this.password.value!,
    };

    this.auth.register(registerData).subscribe({
      next: () => this.router.navigate(['/']),
      error: () =>
        (this.errorMessage =
          "Une erreur est survenue lors de l'inscription, veuillez réessayer plus tard"),
    });
  }

  // Cette fonction permet d'appeler l'API afin de savoir si une adresse email est déjà utilisée ou pas
  // Le service renvoie un simple boolean (true si l'email existe, false sinon), et nous transformons
  // cette réponse en une erreur si il est à true (ou rien si il est à false)
  uniqueEmailAsyncValidator(control: AbstractControl) {
    return this.auth
      .exists(control.value)
      .pipe(map((exists) => (exists ? { unique: true } : null)));
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.registerForm.controls.email;
  }

  get name() {
    return this.registerForm.controls.name;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }
}
