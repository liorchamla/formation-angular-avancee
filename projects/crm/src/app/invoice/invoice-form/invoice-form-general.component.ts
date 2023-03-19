import { Component, Input, OnInit } from '@angular/core';
import { InvoiceFormType } from '../types';

@Component({
  selector: 'app-invoice-form-general',
  template: `
    <ng-container [formGroup]="parent" *ngIf="parent">
      <div class="row">
        <div class="col">
          <label for="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            formControlName="description"
            [class.is-invalid]="description?.invalid && description?.touched"
            placeholder="Description de la facture"
            class="form-control mb-3"
          />
          <p class="invalid-feedback">La description est obligatoire !</p>
        </div>
        <div class="col">
          <label for="customer_name">Client</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            formControlName="customer_name"
            [class.is-invalid]="customerName?.invalid && customerName?.touched"
            placeholder="Nom du client / la société"
            class="form-control mb-3"
          />
          <p class="invalid-feedback">Le client est obligatoire !</p>
        </div>
        <div class="col">
          <label for="status">Statut</label>
          <select
            name="status"
            formControlName="status"
            id="status"
            class="form-control mb-3"
          >
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELED">Annulée</option>
          </select>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class InvoiceFormGeneralComponent implements OnInit {
  @Input('parent') parent?: InvoiceFormType;

  constructor() {}

  ngOnInit(): void {}

  get customerName() {
    return this.parent?.controls.customer_name;
  }

  get description() {
    return this.parent?.controls.description;
  }

  get status() {
    return this.parent?.controls.status;
  }
}
