import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoices-list',
  template: `
    <div class="bg-light p-3 rounded">
      <h1>Liste de vos factures</h1>
      <hr />
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
          <tr>
            <td>1</td>
            <td>Refonte du site web du restaurant</td>
            <td>22/01/2022</td>
            <td class="text-center">1 200,00 €</td>
            <td class="text-center">
              <span class="badge bg-success"> Payée </span>
            </td>
            <td>
              <a routerLink="/invoices/1" class="btn btn-sm btn-primary">
                Modifier
              </a>
              <button class="btn btn-sm ms-1 btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [],
})
export class InvoicesListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
