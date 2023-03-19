import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../types';

@Component({
  selector: 'app-invoice-creation',
  template: `
    <div class="bg-light p-5 rounded">
      <h1>Créer une nouvelle facture</h1>
      <div class="alert bg-warning" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <p class="alert bg-info text-white">
        Remplissez les informations de la facture afin de la retrouver dans
        votre liste plus tard !
      </p>

      <app-invoice-form (form-submit)="onSubmit($event)"></app-invoice-form>
    </div>
  `,
  styles: [],
})
export class InvoiceCreationComponent {
  errorMessage = '';

  constructor(
    private service: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(invoice: Invoice) {
    this.service.create(invoice).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: () =>
        (this.errorMessage =
          "Une erreur est survenue lors de l'enregistrement de la facture, veuillez réessayer"),
    });
  }
}
