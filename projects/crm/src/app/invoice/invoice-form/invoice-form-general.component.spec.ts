import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { InvoiceFormGeneralComponent } from './invoice-form-general.component';

@Component({})
class HostComponent {
  invoiceForm = new FormGroup({
    description: new FormControl(''),
    customer_name: new FormControl(''),
    status: new FormControl(''),
  });
}

describe('InvoiceFormGeneralComponent', () => {
  let spectator: SpectatorHost<InvoiceFormGeneralComponent, HostComponent>;

  const createSpectator = createHostFactory({
    component: InvoiceFormGeneralComponent,
    host: HostComponent,
    imports: [ReactiveFormsModule],
  });

  it("should recognize user's inputs and store them to form", () => {
    spectator = createSpectator(
      `<app-invoice-form-general
            [parent]="invoiceForm"
        ></app-invoice-form-general>`
    );

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER_NAME', '#customer_name');
    spectator.selectOption(spectator.query('#status')!, 'PAID');

    expect(spectator.hostComponent.invoiceForm.value).toEqual({
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER_NAME',
      status: 'PAID',
    });
  });
});
