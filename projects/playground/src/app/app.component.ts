import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Movie DB</h1>

      <app-movies></app-movies>
    </div>
  `,
  styles: [],
})
export class AppComponent {}
