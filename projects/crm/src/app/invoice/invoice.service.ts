import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Invoice } from './types';

const API_URL = environment.apiUrl;

/**
 * Ce service permet de faire des requêtes HTTP vers l'API pour les Invoice
 * Il est utilisé par les composants de l'application et ne nécessite absolument pas d'obtenir le AuthService
 * pour fonctionner, car il existe à côté un intercepteur qui s'occupe de récupérer le token JWT
 */
@Injectable()
export class InvoiceService {
  constructor(private http: HttpClient) {}

  /**
   * Convertit une invoice de l'API (en centimes) en une invoice en Euros
   *
   * @param apiInvoice Une invoice dont les montant sont en centimes
   * @returns Une invoice dont les montants sont en euros
   */
  private mapApiInvoiceToInvoice(apiInvoice: Invoice): Invoice {
    return {
      ...apiInvoice,
      details: apiInvoice.details.map((detail) => ({
        ...detail,
        amount: detail.amount / 100,
      })),
      total: apiInvoice.total! / 100,
    } as Invoice;
  }

  /**
   * Convertit une Invoice en Euros, en une Invoice en centimes !
   *
   * @param invoice Une invoice dont les montant sont en euros
   * @returns La même invoice avec les montants en centimes
   */
  private mapInvoiceToApiInvoice(invoice: Invoice): Invoice {
    return {
      ...invoice,
      details: invoice.details.map((detail) => ({
        ...detail,
        amount: detail.amount * 100,
      })),
    } as Invoice;
  }

  /**
   * Exécute une requête HTTP de création (POST) vers l'API
   *
   * @param invoice La facture à créer
   */
  create(invoice: Invoice) {
    return this.http.post<Invoice>(
      API_URL + '/invoice',
      // Attention : l'API s'attend à recevoir des montants et des totaux en centimes
      // nous convertissons donc notre Invoice (en euros) AVANT de l'envoyer à l'API
      this.mapInvoiceToApiInvoice(invoice)
    );
  }

  /**
   * Exécute une requête HTTP de mise à jour (PUT) vers l'API
   *
   * @param invoice La facture à mettre à jour
   */
  update(invoice: Invoice) {
    return this.http.put<Invoice>(
      API_URL + '/invoice/' + invoice.id,
      // Attention : l'API s'attend à recevoir des montants et des totaux en centimes
      // nous convertissons donc notre Invoice (en euros) AVANT de l'envoyer à l'API
      this.mapInvoiceToApiInvoice(invoice)
    );
  }

  /**
   * Exécute une requête HTTP de suppression (DELETE) vers l'API
   *
   * @param id La facture à supprimer
   */
  delete(id: number) {
    return this.http.delete(API_URL + '/invoice/' + id);
  }

  /**
   * Exécute une requête HTTP de récupération d'une facture (GET) vers l'API
   * @param id L'identifiant de la facture à récupérer
   */
  find(id: number) {
    return (
      this.http
        .get<Invoice>(API_URL + '/invoice/' + id)
        // Attention, les invoices qu'on reçoit ont des totaux et des montants en centimes
        // Nous voulons donc convertir une invoice DE L'API en une invoice
        // telle que nous la voulons dans l'application
        .pipe(map((invoice) => this.mapApiInvoiceToInvoice(invoice)))
    );
  }

  /**
   * Exécute une requête HTTP de récupération de toutes les factures (GET) vers l'API
   */
  findAll() {
    return (
      this.http
        .get<Invoice[]>(API_URL + '/invoice')
        // Attention, les invoices qu'on reçoit ont des totaux et des montants en centimes
        // Nous voulons donc convertir un tableau d'invoices DE L'API en un tableau d'invoices telles
        // que nous les voulons dans notre application
        .pipe(
          // Nous prenons le tableau des invoices
          map((invoices) =>
            // Et nous retournons un nouveau tableau d'invoices, en appliquant la fonction mapApiInvoiceToInvoice sur chacune d'entre elles
            invoices.map((invoice) => this.mapApiInvoiceToInvoice(invoice))
          )
        )
    );
  }
}
