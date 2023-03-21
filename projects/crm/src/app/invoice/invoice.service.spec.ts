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

    expect(req.request.body).toEqual(invoice);
  });
});
