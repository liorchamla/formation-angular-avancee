import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe',
  template: `
    <form [formGroup]="recipe" (submit)="onSubmit()">
      <input
        [class.is-invalid]="
          recipe.controls.title.invalid && recipe.controls.title.touched
        "
        formControlName="title"
        type="text"
        class="form-control mb-2"
        placeholder="Titre de votre recette"
      />
      <p
        class="invalid-feedback"
        *ngIf="
          recipe.controls.title.hasError('required') &&
          recipe.controls.title.touched
        "
      >
        Le titre de la recette est obligatoire
      </p>
      <p
        class="invalid-feedback"
        *ngIf="
          recipe.controls.title.hasError('minlength') &&
          recipe.controls.title.touched
        "
      >
        Le titre de la recette doit faire au moins 3 caractères
      </p>

      <h3>
        Les ingrédients
        <button class="btn btn-primary" (click)="addIngredient()">
          Ajouter
        </button>
      </h3>
      <div formArrayName="ingredients">
        <div
          *ngFor="let group of ingredients.controls; let i = index"
          class="row mb-2"
          [formGroup]="group"
        >
          <div class="col">
            <input
              [class.is-invalid]="
                group.controls.name.invalid && group.controls.name.touched
              "
              type="text"
              class="form-control"
              placeholder="Nom de l'ingrédient"
              formControlName="name"
            />
            <p
              class="invalid-feedback"
              *ngIf="group.controls.name.invalid && group.controls.name.touched"
            >
              Le nom de l'ingrédient est obligatoire
            </p>
          </div>
          <div class="col">
            <input
              [class.is-invalid]="
                group.controls.quantity.invalid &&
                group.controls.quantity.touched
              "
              type="text"
              class="form-control"
              placeholder="Quantité"
              formControlName="quantity"
            />

            <p
              class="invalid-feedback"
              *ngIf="
                group.controls.quantity.invalid &&
                group.controls.quantity.touched
              "
            >
              La quantité de l'ingrédient est obligatoire
            </p>
          </div>
          <div class="col">
            <button
              type="button"
              class="btn btn-sm btn-danger"
              (click)="ingredients.removeAt(i)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <button class="btn btn-success">Enregistrer</button>
    </form>
  `,
  styles: [],
})
export class RecipeComponent {
  recipe = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    /**
     * Ce typage est un peu long, mais il est nécessaire pour qu'Angular
     * comprenne que le tableau contiendra des groupes qui auront systématiquement
     * un champ "name" et un champ "quantity" et ne fasse donc pas d'erreur lorsqu'on
     * demandera à accéder à .name ou .quantity :)
     */
    ingredients: new FormArray<
      FormGroup<{
        name: FormControl;
        quantity: FormControl;
      }>
    >([]),
  });

  addIngredient() {
    this.ingredients.push(
      new FormGroup({
        name: new FormControl('', [Validators.required]),
        quantity: new FormControl('', [Validators.required]),
      })
    );
  }

  get ingredients() {
    return this.recipe.controls.ingredients;
  }

  onSubmit() {
    if (this.recipe.invalid) {
      return;
    }

    console.log(this.recipe.value);
  }
}
