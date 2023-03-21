import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InvoiceFormType } from '../types';

@Component({
  selector: 'app-invoice-form-details',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent && details">
      <h3>Détails de la facture</h3>

      <div
        class="alert bg-warning text-white"
        *ngIf="details.controls.length === 0"
      >
        <p>Vous devez ajouter des détails à votre facture</p>
        <button
          class="btn btn-sm btn-outline-light"
          (click)="addDetailEvent.emit()"
          id="add-detail-initial"
        >
          + Ajouter ma première ligne
        </button>
      </div>

      <section>
        <div
          class="detail-row"
          [formGroup]="group"
          *ngFor="let group of details.controls; let index = index"
        >
          <div class="row mb-3">
            <div class="col-7">
              <input
                type="text"
                placeholder="Description"
                name="description_{{ index }}"
                id="description_{{ index }}"
                formControlName="description"
                [class.is-invalid]="
                  group.controls.description.invalid &&
                  group.controls.description.touched
                "
                class="form-control"
              />
              <p class="invalid-feedback">La description est obligatoire</p>
            </div>
            <div class="col-2">
              <input
                type="number"
                placeholder="Montant"
                class="form-control"
                name="amount_{{ index }}"
                id="amount_{{ index }}"
                formControlName="amount"
                [class.is-invalid]="
                  group.controls.amount.invalid && group.controls.amount.touched
                "
              />
              <p class="invalid-feedback">Le montant est obligatoire</p>
            </div>
            <div class="col-2">
              <input
                type="number"
                placeholder="Quantité"
                class="form-control"
                name="quantity_{{ index }}"
                id="quantity_{{ index }}"
                formControlName="quantity"
                [class.is-invalid]="
                  group.controls.quantity.invalid &&
                  group.controls.quantity.touched
                "
              />
              <p class="invalid-feedback">La quantité est obligatoire</p>
            </div>
            <div class="col-1">
              <button
                type="button"
                class="btn w-auto d-block btn-sm btn-danger"
                (click)="removeDetailEvent.emit(index)"
                id="remove-detail-{{ index }}"
              >
                X
              </button>
            </div>
          </div>
        </div>

        <button
          *ngIf="details.controls.length > 0"
          class="btn btn-primary btn-sm"
          type="button"
          (click)="addDetailEvent.emit()"
          id="add-detail"
        >
          + Ajouter une ligne
        </button>
      </section>

      <p class="alert bg-danger" *ngIf="details.invalid && parent.touched">
        Vous devez ajouter au moins une ligne à votre facture
      </p>
    </ng-container>
  `,
  styles: [],
})
export class InvoiceFormDetailsComponent {
  @Input('parent') parent?: InvoiceFormType;

  @Output('add-detail') addDetailEvent = new EventEmitter();

  @Output('remove-detail') removeDetailEvent = new EventEmitter<number>();

  get details() {
    return this.parent?.controls.details;
  }
}
