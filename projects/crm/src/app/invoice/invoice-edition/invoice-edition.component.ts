import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../types';

@Component({
  selector: 'app-invoice-edition',
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

      <app-invoice-form
        *ngIf="invoice$ | async as invoice"
        [invoice]="invoice"
        (form-submit)="onSubmit($event)"
      ></app-invoice-form>
    </div>
  `,
  styles: [],
})
export class InvoiceEditionComponent implements OnInit {
  // Le futur éventuel message d'erreur
  errorMessage = '';

  // L'observable qui contiendra dans le futur la facture récupérée sur Xano
  invoice$?: Observable<Invoice>;

  // L'identifiant de la facture récupérée
  invoiceId?: number;

  constructor(
    private route: ActivatedRoute,
    private service: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Notre observable invoice$ sera le résultat de l'observable ParamMap de la route,
    // qui à chaque évolution, sera transformé en un identifiant, puis en la facture qui
    // correspond à l'identifiant
    this.invoice$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.invoiceId = +id!)),
      switchMap((id) => this.service.find(+id!))
    );
  }

  onSubmit(invoice: Invoice) {
    // On récupère les informations de la facture et on y ajoute l'identifiant
    const updatedInvoice = { ...invoice, id: this.invoiceId };

    this.service.update(updatedInvoice).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: () =>
        (this.errorMessage =
          "Une erreur est survenue lors de l'enregistrement de la facture, veuillez réessayer plus tard :)"),
    });
  }
}
