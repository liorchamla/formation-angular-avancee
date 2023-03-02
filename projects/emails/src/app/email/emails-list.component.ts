import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { FAKE_EMAILS_DATA } from '../data';
import { Email } from './types';

@Component({
  selector: 'app-emails-list',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <h1>{{ data.title }}</h1>
      <table class="table table-hover">
        <tbody>
          <tr
            (click)="goToEmail(email.id)"
            [class.fw-bold]="!email.read"
            *ngFor="let email of data.emails"
          >
            <td>{{ email.contactName }}</td>
            <td class="w-50">{{ email.subject }}</td>
            <td>{{ email.date }}</td>
            <td>
              <button class="btn btn-sm btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styles: [
    `
      tr {
        cursor: pointer;
      }
    `,
  ],
})
export class EmailsListComponent implements OnInit {
  /**
   * data$ est un observable, qui lorsqu'il aura une valeur, sera un objet contenant à la fois
   * la liste des emails à afficher, et le titre de la page.
   */
  data$?: Observable<{ emails: Email[]; title: string }>;
  /**
   * type est une propriété qui contient le type de la liste d'emails à afficher.
   * Cela peut être null (si on est sur la boîte de réception), "sent" (si on est sur la liste des
   * messages envoyés) ou "trash" (si on est sur la corbeille).
   *
   * On en a besoin pour savoir comment rediriger vers la page d'un email en particulier :
   * /emails        => lien pour lire un email : read/:id
   * /emails/sent   => lien pour lire un email : ../read/:id
   * /emails/trash  => lien pour lire un email : ../read/:id
   */
  type?: string | null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToEmail(id: number) {
    /**
     * Si on n'a pas de type, alors la redirection se fait vers : read/:id
     */
    if (!this.type) {
      this.router.navigate(['read', id], { relativeTo: this.route });
      return;
    }

    /**
     * Sinon, on est sur /emails/sent ou /emails/trash et on redirige vers : ../read/:id
     * pour arriver sur /emails/read/:id
     */
    this.router.navigate(['../', 'read', id], { relativeTo: this.route });
  }

  ngOnInit(): void {
    /**
     * On va expliquer quelle donnée doit émettre notre observable data$ en fonction des params de la
     * route. Dès que les params de la route vont changer, data$ va émettre une nouvelle valeur
     * transformée grâce au pipe()
     */
    this.data$ = this.route.data.pipe(
      map((data) => {
        return {
          emails: data['emails'],
          title: data['title'],
        };
      })
    );
  }
}
