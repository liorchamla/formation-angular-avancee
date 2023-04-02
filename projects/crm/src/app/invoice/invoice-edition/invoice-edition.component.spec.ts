import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { InvoiceFormDetailsComponent } from '../invoice-form/invoice-form-details.component';
import { InvoiceFormGeneralComponent } from '../invoice-form/invoice-form-general.component';
import { InvoiceFormTotalsComponent } from '../invoice-form/invoice-form-totals.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoiceService } from '../invoice.service';
import { Invoice, InvoiceFormType } from '../types';
import { InvoiceEditionComponent } from './invoice-edition.component';

describe('InvoiceEditionComponent', () => {
  let spectator: Spectator<InvoiceEditionComponent>;
  let component: InvoiceEditionComponent;
  let invoiceService: jasmine.SpyObj<InvoiceService>;
  const MOCK_INVOICE: Invoice = {
    id: 1,
    description: 'MOCK_DESCRIPTION',
    customer_name: 'MOCK_CUSTOMER_NAME',
    status: 'SENT',
    details: [
      {
        amount: 200,
        quantity: 2,
        description: 'MOCK_DESCRIPTION',
      },
      {
        amount: 100,
        quantity: 1,
        description: 'MOCK_DESCRIPTION_2',
      },
    ],
  };

  const createSpectator = createComponentFactory({
    component: InvoiceEditionComponent,
    imports: [ReactiveFormsModule],
    mocks: [ActivatedRoute, Router, InvoiceService],
    declarations: [
      InvoiceFormComponent,
      InvoiceFormDetailsComponent,
      InvoiceFormGeneralComponent,
      InvoiceFormTotalsComponent,
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createSpectator();
    component = spectator.component;
    invoiceService = spectator.inject(InvoiceService);
    invoiceService.find.and.returnValue(of(MOCK_INVOICE));

    spyOnProperty(spectator.inject(ActivatedRoute), 'paramMap').and.returnValue(
      of(convertToParamMap({ id: MOCK_INVOICE.id }))
    );
  });

  it('should fill the form with the invoice data if find() succeeds', () => {
    spectator.detectChanges();

    expect(spectator.query<HTMLInputElement>('#description')).toHaveValue(
      MOCK_INVOICE.description
    );
    expect(spectator.query<HTMLInputElement>('#customer_name')).toHaveValue(
      MOCK_INVOICE.customer_name
    );
    expect(spectator.query<HTMLInputElement>('#status')).toHaveValue(
      MOCK_INVOICE.status
    );
    expect(spectator.queryAll('.detail-row')).toHaveLength(2);

    expect(spectator.query<HTMLInputElement>('#amount_0')).toHaveValue('200');
  });

  it('should redirect to ../ if update succeeds', () => {
    spectator.detectChanges();

    invoiceService.update.and.returnValue(of({ ...MOCK_INVOICE }));

    spectator.click('#submit');

    expect(invoiceService.update).toHaveBeenCalledWith({ ...MOCK_INVOICE });

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: spectator.inject(ActivatedRoute),
    });
  });

  it('should not redirect if update fails', () => {
    spectator.detectChanges();

    invoiceService.update.and.returnValue(throwError(() => of(null)));

    spectator.click('#submit');

    expect(invoiceService.update).toHaveBeenCalledWith({ ...MOCK_INVOICE });

    expect(spectator.inject(Router).navigate).not.toHaveBeenCalled();

    expect(spectator.query('.alert.bg-warning')).toExist();
  });
});
