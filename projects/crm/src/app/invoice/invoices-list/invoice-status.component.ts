import { Component, Input } from '@angular/core';
import { InvoiceStatus } from '../types';

@Component({
  selector: 'invoice-status',
  template: `
    <span class="badge {{ statusClassName }}">
      {{ statusLabel }}
    </span>
  `,
})
export class InvoiceStatusComponent {
  @Input() status: InvoiceStatus = 'SENT';

  get statusLabel() {
    return this.status === 'SENT'
      ? 'Envoyée'
      : this.status === 'PAID'
      ? 'Payée'
      : 'Annulée';
  }

  get statusClassName() {
    return this.status === 'SENT'
      ? 'bg-info'
      : this.status === 'PAID'
      ? 'bg-success'
      : 'bg-danger';
  }
}
