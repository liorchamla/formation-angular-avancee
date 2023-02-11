import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emails',
  template: `
    <div class="row">
      <div class="col-12 col-md-3">
        <a routerLink="/emails/create" class="btn btn-dark d-block mb-4"
          >Nouveau message</a
        >
        <ul class="nav nav-pills flex-column">
          <li class="nav-item">
            <a routerLink="/emails" class="nav-link">Boîte de réception</a>
          </li>
          <li class="nav-item">
            <a routerLink="/emails/sent" class="nav-link">Messages envoyés</a>
          </li>
          <li class="nav-item">
            <a routerLink="/emails/trash" class="nav-link">Corbeille</a>
          </li>
        </ul>
      </div>
      <div class="col">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [],
})
export class EmailsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
