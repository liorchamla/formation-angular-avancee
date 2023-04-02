import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';
import { environment } from '../../environments/environment';
import { InvoiceService } from './invoice.service';
import { Invoice } from './types';

const API_URL = environment.apiUrl;

describe('InvoiceService', () => {
  let spectator: SpectatorHttp<InvoiceService>;
  let service: InvoiceService;

  const createSpectator = createHttpFactory({
    service: InvoiceService,
  });

  beforeEach(() => {
    spectator = createSpectator();
    service = spectator.service;
  });

  it('should call /invoice with POST when we call InvoiceService.create()', () => {
    const invoice: Invoice = {
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER_NAME',
      status: 'PAID',
      details: [
        {
          description: 'MOCK_DETAIL_DESCRIPTION',
          quantity: 10,
          amount: 10,
        },
      ],
    };

    service.create(invoice).subscribe();

    const req = spectator.expectOne(API_URL + '/invoice', HttpMethod.POST);

    expect(req.request.body).toEqual({
      ...invoice,
      details: [
        {
          ...invoice.details[0],
          amount: invoice.details[0].amount * 100,
        },
      ],
    });
  });

  it('should call /invoice/:id with PUT when we call InvoiceService.update()', () => {
    const invoice: Invoice = {
      id: 42,
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER_NAME',
      status: 'PAID',
      details: [
        {
          description: 'MOCK_DETAIL_DESCRIPTION',
          quantity: 10,
          amount: 10,
        },
      ],
    };

    service.update(invoice).subscribe();

    const req = spectator.expectOne(API_URL + '/invoice/42', HttpMethod.PUT);

    expect(req.request.body).toEqual({
      ...invoice,
      details: [
        {
          ...invoice.details[0],
          amount: invoice.details[0].amount * 100,
        },
      ],
    });
  });

  it('should call /invoice/:id with DELETE when we call InvoiceService.delete()', () => {
    service.delete(42).subscribe();

    spectator.expectOne(API_URL + '/invoice/42', HttpMethod.DELETE);
  });

  it('should call /invoice with GET when we call InvoiceService.findAll()', (done: DoneFn) => {
    service.findAll().subscribe((invoices) => {
      expect(invoices[0].details[0].amount).toEqual(100);
      expect(invoices[0].total).toEqual(1000);
      done();
    });

    spectator.expectOne(API_URL + '/invoice', HttpMethod.GET).flush([
      {
        id: 42,
        description: 'MOCK_DESCRIPTION',
        customer_name: 'MOCK_CUSTOMER_NAME',
        status: 'PAID',
        total: 100000,
        details: [
          {
            description: 'MOCK_DETAIL_DESCRIPTION',
            quantity: 10,
            amount: 10000,
          },
        ],
      },
    ]);
  });

  it('should call /invoice/:id with GET when we call InvoiceService.find()', (done: DoneFn) => {
    service.find(42).subscribe((invoice) => {
      expect(invoice.details[0].amount).toEqual(100);
      expect(invoice.total).toEqual(1000);
      done();
    });

    spectator.expectOne(API_URL + '/invoice/42', HttpMethod.GET).flush({
      id: 42,
      description: 'MOCK_DESCRIPTION',
      customer_name: 'MOCK_CUSTOMER_NAME',
      status: 'PAID',
      total: 100000,
      details: [
        {
          description: 'MOCK_DETAIL_DESCRIPTION',
          quantity: 10,
          amount: 10000,
        },
      ],
    });
  });
});
