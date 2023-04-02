import { ActivatedRoute, RouterModule } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../types';
import { InvoiceStatusComponent } from './invoice-status.component';
import { InvoicesListComponent } from './invoices-list.component';

describe('InvoicesListComponent', () => {
  let spectator: Spectator<InvoicesListComponent>;

  let invoiceService: jasmine.SpyObj<InvoiceService>;

  let MOCK_INVOICES: Invoice[] = [];

  const createSpectator = createComponentFactory({
    component: InvoicesListComponent,
    imports: [RouterModule],
    declarations: [InvoiceStatusComponent],
    mocks: [InvoiceService, ActivatedRoute],
    detectChanges: false,
  });

  beforeEach(() => {
    MOCK_INVOICES = getMockInvoices();

    spectator = createSpectator();

    invoiceService = spectator.inject(InvoiceService);

    invoiceService.findAll.and.returnValue(of(MOCK_INVOICES));
  });

  it('should display a list of invoices if request succeeds', () => {
    spectator.detectChanges();

    expect(spectator.queryAll('tbody tr').length).toEqual(2);
    expect(spectator.query('tbody tr')?.innerHTML).toContain('300,00&nbsp;€');
  });

  it('should display a list of invoices if request fails', () => {
    invoiceService.findAll.and.returnValue(throwError(() => of(null)));

    spectator.detectChanges();

    expect(spectator.query('.alert.bg-danger')).toExist();
  });

  it('should delete an invoice if request succeeds', () => {
    spectator.detectChanges();

    invoiceService.delete.and.returnValue(of({}));

    spectator.click('#delete-button-1');

    expect(invoiceService.delete).toHaveBeenCalledWith(1);

    expect(spectator.queryAll('tbody tr').length).toEqual(1);
  });

  it('should not delete an invoice if request fails', () => {
    spectator.detectChanges();

    invoiceService.delete.and.returnValue(throwError(() => of(null)));

    spectator.click('#delete-button-1');

    expect(invoiceService.delete).toHaveBeenCalledWith(1);

    expect(spectator.queryAll('tbody tr').length).toEqual(2);
  });
});

const getMockInvoices = (): Invoice[] => [
  {
    id: 1,
    description: 'MOCK_DESCRIPTION',
    customer_name: 'MOCK_CUSTOMER_NAME',
    status: 'PAID',
    created_at: Date.now(),
    total: 300,
    details: [],
  },
  {
    id: 2,
    description: 'MOCK_DESCRIPTION',
    customer_name: 'MOCK_CUSTOMER_NAME',
    status: 'PAID',
    created_at: Date.now(),
    total: 500,
    details: [],
  },
];
