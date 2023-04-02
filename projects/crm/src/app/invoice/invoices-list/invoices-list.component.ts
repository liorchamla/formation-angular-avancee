import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../types';

@Component({
  selector: 'app-invoices-list',
  template: `
    <div class="bg-light p-3 rounded">
      <h1>Liste de vos factures</h1>
      <hr />
      <div class="alert bg-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Description</th>
            <th>Date</th>
            <th class="text-center">Total HT</th>
            <th class="text-center">Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let invoice of invoices">
            <td>{{ invoice.id }}</td>
            <td>{{ invoice.description }}</td>
            <td>{{ invoice.created_at | date : 'dd/MM/yyyy' }}</td>
            <td class="text-center">
              {{
                invoice.total | currency : 'EUR' : 'symbol' : undefined : 'fr'
              }}
            </td>
            <td class="text-center">
              <invoice-status [status]="invoice.status"></invoice-status>
            </td>
            <td>
              <a [routerLink]="[invoice.id]" class="btn btn-sm btn-primary">
                Modifier
              </a>
              <button
                class="btn btn-sm ms-1 btn-danger"
                (click)="onDelete(invoice.id!)"
                id="delete-button-{{ invoice.id }}"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [],
})
export class InvoicesListComponent implements OnInit {
  errorMessage = '';

  invoices: Invoice[] = [];

  destroy$ = new Subject();

  constructor(private service: InvoiceService) {}

  ngOnInit(): void {
    this.service
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: () =>
          (this.errorMessage =
            'Il y a eu un problème lors de la récupération des factures'),
      });
  }

  onDelete(id: number) {
    const oldInvoices = [...this.invoices];

    this.invoices = this.invoices.filter((item) => item.id !== id);

    this.service
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {},
        error: () => {
          this.errorMessage =
            'Il y a eu un problème lors de la suppression de la facture';
          this.invoices = oldInvoices;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }
}
