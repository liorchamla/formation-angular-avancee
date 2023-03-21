import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { InvoiceFormDetailsComponent } from '../invoice-form/invoice-form-details.component';
import { InvoiceFormGeneralComponent } from '../invoice-form/invoice-form-general.component';
import { InvoiceFormTotalsComponent } from '../invoice-form/invoice-form-totals.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoiceService } from '../invoice.service';
import { InvoiceCreationComponent } from './invoice-creation.component';

describe('InvoiceCreationComponent', () => {
  let spectator: Spectator<InvoiceCreationComponent>;
  let component: InvoiceCreationComponent;

  const createSpectator = createComponentFactory({
    component: InvoiceCreationComponent,
    imports: [ReactiveFormsModule],
    declarations: [
      InvoiceFormComponent,
      InvoiceFormDetailsComponent,
      InvoiceFormGeneralComponent,
      InvoiceFormTotalsComponent,
    ],
    mocks: [InvoiceService, Router, ActivatedRoute],
  });

  beforeEach(() => {
    spectator = createSpectator();
    component = spectator.component;
  });

  it('should redirect to ../ if InvoiceService.create() succeeds', () => {
    spectator.inject(InvoiceService).create.and.returnValue(of(null));

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER_NAME', '#customer_name');
    spectator.click('#add-detail-initial');
    spectator.typeInElement('MOCK_DETAIL_DESCRIPTION', '#description_0');
    spectator.typeInElement('10', '#quantity_0');
    spectator.typeInElement('10', '#amount_0');

    spectator.click('#submit');

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['../'], {
      relativeTo: spectator.inject(ActivatedRoute),
    });
    expect(spectator.query('.alert.bg-warning')).not.toExist();
  });

  it('should not redirect to ../ if InvoiceService.create() fails', () => {
    spectator
      .inject(InvoiceService)
      .create.and.returnValue(throwError(() => of(null)));

    spectator.typeInElement('MOCK_DESCRIPTION', '#description');
    spectator.typeInElement('MOCK_CUSTOMER_NAME', '#customer_name');
    spectator.click('#add-detail-initial');
    spectator.typeInElement('MOCK_DETAIL_DESCRIPTION', '#description_0');
    spectator.typeInElement('10', '#quantity_0');
    spectator.typeInElement('10', '#amount_0');

    spectator.click('#submit');

    expect(spectator.inject(Router).navigate).not.toHaveBeenCalled();
    expect(spectator.query('.alert.bg-warning')).toExist();
  });
});
