import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { FAKE_EMAILS_DATA } from '../data';
import { Email } from './types';

@Component({
  selector: 'app-email-details',
  template: `
    <ng-template #fallBack>
      <h2>Une erreur est survenue, aucun email trouvé</h2>
      <a [routerLink]="['../../']" class="btn btn-primary">
        Revenir à la boîte de réception
      </a>
    </ng-template>
    <ng-container *ngIf="email$ | async as email; else fallBack">
      <h1>{{ email.subject }}</h1>
      <div class="d-flex justify-content-between align-items-center">
        <em
          >De {{ email.contactName }} ({{ email.from }}), le
          {{ email.date }}</em
        >
        <button class="btn btn-danger" (click)="onDelete()">Supprimer</button>
      </div>
      <hr />
      <p *ngFor="let part of splitBody(email.body)">
        {{ part }}
      </p>
      <nav>
        <a
          *ngIf="email.id > 0"
          [routerLink]="['../', email.id - 1]"
          class="btn btn-secondary"
          >&lt; Mail précédent</a
        ><a [routerLink]="['../', email.id + 1]" class="btn btn-secondary"
          >Mail suivant &gt;</a
        >
      </nav>
    </ng-container>
  `,
  styles: [],
})
export class EmailDetailsComponent implements OnInit {
  /**
   * email$ est un observable qui changera à chaque fois que la route changera et contiendra
   * l'email correspondant à l'id qui se trouve dans la route
   */
  email$?: Observable<Email>;

  splitBody(body: string) {
    return body.split('\n');
  }

  constructor(private route: ActivatedRoute, private router: Router) {}

  onDelete() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  ngOnInit(): void {
    // On écoute chaque changement de la paramMap (les paramètres de la route)
    this.email$ = this.route.paramMap.pipe(
      // Si dans les paramètres, on ne trouve pas "id", on ne fait rien
      filter((params) => params.has('id')),
      // Si on trouve "id", on le transforme en nombre
      map((params) => +params.get('id')!),
      // Et on cherche l'email correspondant dans la liste des emails
      map((id) => FAKE_EMAILS_DATA.find((email) => email.id === id) as Email)
    );
  }
}
