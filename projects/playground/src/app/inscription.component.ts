import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  template: `
    <div class="container">
      <h1>Angular Avancé !</h1>
      <pre>{{ form.value | json }}</pre>
      Formulaire valide : {{ form.valid }}
      <form #form="ngForm" (submit)="onSubmit(form)">
        <input
          required
          email
          [(ngModel)]="data.email"
          bannedEmail="test@test.com"
          uniqueEmail
          #email="ngModel"
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

        <app-color-picker
          [(ngModel)]="data.color"
          [ngModelOptions]="{ name: 'color' }"
          label="Quelle est votre couleur préférée ?"
          color="red"
        ></app-color-picker>

        <ng-container ngModelGroup="security" confirmPassword>
          <input
            required
            minlength="3"
            [(ngModel)]="data.password"
            #password="ngModel"
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
            Le mot de passe doit faire au moins 3 caractères
          </p>
          <input
            required
            minlength="3"
            ngModel
            #confirm="ngModel"
            [class.is-invalid]="confirm.invalid && confirm.touched"
            [class.is-valid]="confirm.valid && confirm.touched"
            type="password"
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
            *ngIf="confirm.touched && confirm.hasError('minlength')"
          >
            La confirmation du mot de passe doit faire au moins 3 caractères
          </p>
          <p
            class="invalid-feedback"
            *ngIf="confirm.touched && confirm.hasError('confirmPassword')"
          >
            La confirmation du mot de passe est incorrecte
          </p>
        </ng-container>
        <button class="btn btn-success" [disabled]="form.invalid">
          Inscription
        </button>
      </form>
    </div>
  `,
  styles: [],
})
export class InscriptionComponent {
  data = {
    email: 'lior@mail.com',
    color: 'red',
    password: 'password',
  };

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log(form.value);
  }
}
