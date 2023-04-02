import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { InvoiceStatusComponent } from './invoice-status.component';

describe('InvoiceStatusComponent', () => {
  let spectator: SpectatorHost<InvoiceStatusComponent>;
  const createSpectator = createHostFactory({
    component: InvoiceStatusComponent,
    declarations: [InvoiceStatusComponent],
    template: `<invoice-status [status]="status"></invoice-status>`,
  });

  it('should display the status label and have the proper className', () => {
    spectator = createSpectator(undefined, {
      hostProps: {
        status: 'SENT',
      },
    });

    expect(spectator.query('span')).toHaveText('Envoyée');
    expect(spectator.query('span')).toHaveClass('bg-info');

    spectator.setHostInput({
      status: 'PAID',
    });

    expect(spectator.query('span')).toHaveText('Payée');
    expect(spectator.query('span')).toHaveClass('bg-success');

    spectator.setHostInput({
      status: 'CANCELLED',
    });

    expect(spectator.query('span')).toHaveText('Annulée');
    expect(spectator.query('span')).toHaveClass('bg-danger');
  });
});
