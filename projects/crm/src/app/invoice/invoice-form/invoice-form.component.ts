import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Invoice, InvoiceFormType } from '../types';

const { required, minLength, min } = Validators;

@Component({
  selector: 'app-invoice-form',
  template: `
    <form (ngSubmit)="onSubmit()" [formGroup]="invoiceForm">
      <app-invoice-form-general
        [parent]="invoiceForm"
      ></app-invoice-form-general>

      <hr />

      <app-invoice-form-details
        [parent]="invoiceForm"
        (add-detail)="onAddDetail()"
        (remove-detail)="onRemoveDetail($event)"
      ></app-invoice-form-details>

      <hr />

      <app-invoice-form-totals [total]="total"></app-invoice-form-totals>

      <button class="mt-3 w-sm-auto btn btn-success" id="submit">
        Enregistrer
      </button>
    </form>
  `,
  styles: [],
})
export class InvoiceFormComponent implements OnInit {
  @Input() invoice?: Invoice;

  @Output('form-submit') formSubmitEvent = new EventEmitter<Invoice>();

  invoiceForm: InvoiceFormType = this.fb.group({
    description: ['', [required, minLength(10)]],
    customer_name: ['', [required, minLength(5)]],
    status: ['SENT'],
    details: this.fb.array<FormGroup>([], noEmptyDetailsValidator),
  });

  onAddDetail() {
    this.details.push(
      this.fb.group({
        amount: ['', [required, min(0)]],
        quantity: ['', [required, min(0)]],
        description: ['', [required, minLength(5)]],
      })
    );
  }

  onRemoveDetail(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    if (this.invoiceForm.invalid) {
      return;
    }

    this.formSubmitEvent.emit(this.invoiceForm.value as Invoice);
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.invoice) {
      return;
    }

    this.invoice.details.forEach((item) => this.onAddDetail());

    this.invoiceForm.patchValue(this.invoice);
  }

  get details() {
    return this.invoiceForm.controls.details;
  }

  get total() {
    return this.details.value.reduce((acc, item) => {
      return acc + item.amount * item.quantity;
    }, 0);
  }
}

const noEmptyDetailsValidator: ValidatorFn = (detailsControl) => {
  if (detailsControl.value.length === 0) {
    return { noEmptyDetails: true };
  }

  return null;
};
