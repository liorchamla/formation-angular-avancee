import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reactive-inscription',
  template: `
    <div class="container">
      <h1>Angular Avancé !</h1>
      <form [formGroup]="inscription" (submit)="onSubmit()">
        <input
          formControlName="email"
          [class.is-invalid]="email.invalid && email.touched"
          [class.is-valid]="email.valid && email.touched"
          type="email"
          name="email"
          id="email"
          class="form-control mb-2"
          placeholder="Votre adresse email"
        />
        <p class="text-info" *ngIf="email.pending">
          <span class="spinner-border spinner-border-sm"></span>
          Vérification de l'adresse email...
        </p>
        <p
          class="invalid-feedback"
          *ngIf="email.touched && email.hasError('required')"
        >
          L'adresse email est obligatoire
        </p>
        <p
          class="invalid-feedback"
          *ngIf="email.touched && email.hasError('email')"
        >
          L'adresse email n'est pas valide
        </p>
        <p
          class="invalid-feedback"
          *ngIf="email.touched && email.hasError('bannedEmail')"
        >
          L'adresse email est interdite
        </p>
        <p
          class="invalid-feedback"
          *ngIf="email.touched && email.hasError('uniqueEmail')"
        >
          L'adresse email est déjà utilisée
        </p>

        <ng-container formGroupName="security">
          <input
            formControlName="password"
            [class.is-invalid]="password.invalid && password.touched"
            [class.is-valid]="password.valid && password.touched"
            type="password"
            name="password"
            id="password"
            class="form-control mb-2"
            placeholder="Mot de passe"
          />
          <p
            class="invalid-feedback"
            *ngIf="password.touched && password.hasError('required')"
          >
            Le mot de passe est obligatoire
          </p>
          <p
            class="invalid-feedback"
            *ngIf="password.touched && password.hasError('minlength')"
          >
            Le mot de passe doit faire au moins 4 caractères
          </p>
          <input
            type="password"
            formControlName="confirm"
            [class.is-invalid]="confirm.invalid && confirm.touched"
            [class.is-valid]="confirm.valid && confirm.touched"
            name="confirm"
            id="confirm"
            class="form-control mb-2"
            placeholder="Confirmation du mot de passe"
          />
          <p
            class="invalid-feedback"
            *ngIf="confirm.touched && confirm.hasError('required')"
          >
            La confirmation du mot de passe est obligatoire
          </p>
          <p
            class="invalid-feedback"
            *ngIf="confirm.touched && confirm.hasError('confirmPassword')"
          >
            La confirmation du mot de passe est incorrecte
          </p>
        </ng-container>
        <app-color-picker formControlName="favoriteColor"></app-color-picker>
        <h3>
          Quels sont vos langages favoris ?
          <button class="btn btn-sm btn-primary" (click)="addLanguage()">
            Ajouter
          </button>
        </h3>
        <div formArrayName="languages">
          <ng-container *ngIf="languages.length === 0">
            <p class="alert bg-info text-white">
              Vous pouvez ajouter un langage en cliquant sur le bouton ci-dessus
            </p>
          </ng-container>
          <div *ngFor="let group of languages.controls; let i = index">
            <div [formGroup]="group" class="row">
              <div class="col">
                <input
                  formControlName="name"
                  type="text"
                  name="name"
                  id="name"
                  class="form-control mb-2"
                  placeholder="Nom du langage"
                />
              </div>
              <div class="col">
                <select
                  formControlName="level"
                  name="level"
                  id="level"
                  class="form-control mb-2"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div class="col">
                <button
                  type="button"
                  class="btn btn-danger"
                  (click)="removeLanguage(i)"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
        <p
          class="alert bg-danger text-white"
          *ngIf="languages.hasError('mustHave2Languages')"
        >
          Veuillez ajouter au moins 2 langages
        </p>
        <button class="btn btn-success">Inscription</button>
      </form>
    </div>
  `,
  styles: [],
})
export class ReactiveInscriptionComponent {
  // Notre formulaire est un ensemble de champs (un FormGroup)
  inscription = new FormGroup({
    // Ceci est un champ "collection" (FormArray) qui contiendra des FormGroup
    languages: new FormArray<FormGroup>([]),
    favoriteColor: new FormControl(''),
    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.email,
        bannedEmailValidator('test@test.com'),
      ],
      [uniqueEmailValidator]
    ),
    security: new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        confirm: new FormControl('', [Validators.required]),
      },
      {
        validators: [confirmPasswordValidator],
      }
    ),
  });

  ngOnInit() {
    // Sur n'importe quel FormControl, FormGroup ou FormArray, on peut écouter
    // les changements de valeur avec la propriété valueChanges qui est un
    // Observable !
    this.favoriteColor.valueChanges.subscribe((value) => {
      // Si la valeur est "purple", on ajoute le validateur
      // et on met à jour la validité du champ
      if (value === 'purple') {
        this.languages.addValidators(mustHave2LanguagesValidator);
        this.languages.updateValueAndValidity();
        return;
      }

      // Sinon, on supprime le validateur et on met à jour la validité du champ
      this.languages.removeValidators(mustHave2LanguagesValidator);
      this.languages.updateValueAndValidity();
    });
  }

  addLanguage() {
    this.languages.push(
      new FormGroup({
        name: new FormControl(''),
        level: new FormControl('debutant'),
      })
    );
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  get favoriteColor() {
    return this.inscription.controls.favoriteColor;
  }

  get languages() {
    return this.inscription.controls.languages;
  }

  get email() {
    return this.inscription.controls.email;
  }

  get password() {
    return this.security.controls.password;
  }

  get confirm() {
    return this.security.controls.confirm;
  }

  get security() {
    return this.inscription.controls.security;
  }

  onSubmit() {
    console.log(this.inscription.value);
  }
}

/**
 * Vérifie qu'un FormArray ait au moins 2 éléments
 */
const mustHave2LanguagesValidator: ValidatorFn = (control: AbstractControl) => {
  // Si notre FormArray a moins de 2 éléments,
  // on retourne un objet avec une propriété qui correspond à notre erreur
  if (control.value.length < 2) {
    return { mustHave2Languages: true };
  }

  // Sinon, on retourne null (pas d'erreur)
  return null;
};

/**
 * Vérifie que le password et la confirmation soient identiques en recevant
 * un FormGroup qui contient les 2 champs
 */
const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl<{
    password: AbstractControl<string>;
    confirm: AbstractControl<string>;
  }>
) => {
  // On récupère les 2 champs
  const password = control.get('password');
  const confirm = control.get('confirm');

  // Si les valeurs ne sont pas identiques, on retourne un objet avec une
  // propriété qui correspond à notre erreur
  if (password?.value !== confirm?.value) {
    // On peut aussi mettre à jour la validité du champ de confirmation
    confirm?.setErrors({ confirmPassword: true });

    return { confirmPassword: true };
  }

  // Sinon, on retourne null (pas d'erreur)
  return null;
};

/**
 * Vérifie que l'email n'existe pas déjà en base de données
 */
const uniqueEmailValidator: AsyncValidatorFn = (
  control: AbstractControl<string>
) => {
  // On retourne le résultat d'une requête HTTP, résultat qui sera transformé en
  // un objet représentant l'erreur si il y en a une ou en null si tout est ok
  return fetch(
    'https://jsonplaceholder.typicode.com/users?email=' + control.value
  )
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        return { uniqueEmail: true };
      }

      return null;
    });
};

/**
 * Vérifie que l'email n'est pas interdit, remarquez que cette fonction en elle-même
 * N'EST PAS UN VALIDATEUR ! Elle RETOURNE un validateur
 */
const bannedEmailValidator = (bannedEmail: string): ValidatorFn => {
  // On retourne un validateur qui pourra être utilisé dans notre formulaire
  return (control: AbstractControl<string>) => {
    // Si l'email est interdit, on retourne un objet avec une propriété qui
    // correspond à notre erreur
    if (control.value === bannedEmail) {
      return { bannedEmail: true };
    }

    // Sinon, on retourne null (pas d'erreur)
    return null;
  };
};
