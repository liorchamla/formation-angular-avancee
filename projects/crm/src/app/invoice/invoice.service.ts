import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
   * Exécute une requête HTTP de création (POST) vers l'API
   *
   * @param invoice La facture à créer
   */
  create(invoice: Invoice) {
    return this.http.post<Invoice>(API_URL + '/invoice', invoice);
  }

  /**
   * Exécute une requête HTTP de mise à jour (PUT) vers l'API
   *
   * @param invoice La facture à mettre à jour
   */
  update(invoice: Invoice) {
    return this.http.put<Invoice>(API_URL + '/invoice/' + invoice.id, invoice);
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
    return this.http.get<Invoice>(API_URL + '/invoice/' + id);
  }

  /**
   * Exécute une requête HTTP de récupération de toutes les factures (GET) vers l'API
   */
  findAll() {
    return this.http.get<Invoice[]>(API_URL + '/invoice');
  }
}
