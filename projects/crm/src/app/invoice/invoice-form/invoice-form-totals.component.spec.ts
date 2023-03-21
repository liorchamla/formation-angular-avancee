import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import {
  InvoiceFormTotalsComponent,
  TVA_RATE_TOKEN,
} from './invoice-form-totals.component';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr);

describe('InvoiceFormTotalsComponent', () => {
  let spectator: SpectatorHost<InvoiceFormTotalsComponent>;

  const createSpectator = createHostFactory({
    template: `<app-invoice-form-totals [total]="100"></app-invoice-form-totals>`,
    component: InvoiceFormTotalsComponent,
    providers: [{ provide: TVA_RATE_TOKEN, useValue: 0.2 }],
  });

  it('should display the total HT, the total TVA and the total TTC', () => {
    spectator = createSpectator();

    expect(spectator.query('#total_ht')?.innerHTML).toContain('100,00&nbsp;€');
    expect(spectator.query('#total_tva')?.innerHTML).toContain('20,00&nbsp;€');
    expect(spectator.query('#total_ttc')?.innerHTML).toContain('120,00&nbsp;€');
  });
});
