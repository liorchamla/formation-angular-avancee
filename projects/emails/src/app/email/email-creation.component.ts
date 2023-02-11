import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-creation',
  template: `
    <h1>Nouveau message</h1>

    <form>
      <div class="form-group mb-2">
        <input type="email" placeholder="Adresse email" class="form-control" />
      </div>
      <div class="form-group mb-2">
        <input
          type="text"
          placeholder="Sujet du message"
          class="form-control"
        />
      </div>
      <div class="form-group mb-2">
        <textarea
          placeholder="Contenu du message"
          class="form-control"
        ></textarea>
      </div>
      <button class="btn btn-primary">Envoyer !</button>
    </form>
  `,
  styles: [],
})
export class EmailCreationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
