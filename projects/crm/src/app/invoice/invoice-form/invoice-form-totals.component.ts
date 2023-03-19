import {
  Component,
  Inject,
  InjectionToken,
  Input,
  OnInit,
} from '@angular/core';

// On peut créer un jeton d'injection de dépendance qui permettra, où qu'on se trouve
// de demander quel est le taux de TVA applicable aux factures
export const TVA_RATE_TOKEN = new InjectionToken<number>(
  'Taux de TVA applicable aux factures',
  // Grâce à l'option "factory", on peut définir une fonction qui sera exécutée
  // quand on demande le taux de TVA, et qui permet de définir une valeur par défaut de 0.2
  // Si dans un certain contexte, on souhaite changer la valeur du taux de TVA, on pourra
  // utiliser le provider suivant :
  // { provide: TVA_RATE_TOKEN, useValue: 0.5 }
  {
    factory: () => 0.2,
  }
);

@Component({
  selector: 'app-invoice-form-totals',
  template: `
    <ng-container *ngIf="total !== undefined">
      <div class="row">
        <div class="col-6 text-end">Total HT :</div>
        <div class="col" id="total_ht">
          {{ total | currency : 'EUR' : 'symbol' : undefined : 'fr' }}
        </div>
      </div>
      <div class="row">
        <div class="col-6 text-end">Total TVA :</div>
        <div class="col" id="total_tva">
          {{ totalTVA | currency : 'EUR' : 'symbol' : undefined : 'fr' }}
        </div>
      </div>
      <div class="row fw-bold">
        <div class="col-6 text-end">Total TTC :</div>
        <div class="col" id="total_ttc">
          {{ totalTTC | currency : 'EUR' : 'symbol' : undefined : 'fr' }}
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class InvoiceFormTotalsComponent {
  @Input() total: number = 0;

  constructor(@Inject(TVA_RATE_TOKEN) private tvaRate: number) {}

  get totalTVA() {
    return this.total * this.tvaRate;
  }

  get totalTTC() {
    return this.total + this.totalTVA;
  }
}
