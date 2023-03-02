import { Component, OnInit } from '@angular/core';
import {
  ActivationStart,
  GuardsCheckEnd,
  NavigationEnd,
  ResolveEnd,
  Router,
} from '@angular/router';
import { delay, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-loading-bar',
  template: `<div
    [ngStyle]="{ width: width, display: display }"
    class="loading-bar"
  ></div> `,
  styles: [
    `
      .loading-bar {
        position: absolute;
        inset: 0;
        height: 5px;
        background-color: #007bff;
        z-index: 1000;
        transition: width 0.5s;
      }
    `,
  ],
})
export class LoadingBarComponent implements OnInit {
  /**
   * La largeur que prendra la loading bar, elle évoluera de 0 à 100% en fonction des événements du router
   */
  _width = 0;

  /**
   * Le fait qu'on affiche ou pas la loading bar, elle s'affiche quand le routing commence et
   * disparaît quand il est terminé
   */
  display = 'none';

  get width() {
    return this._width + '%';
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    // On crée une map qui associe à chaque événement du router une largeur
    // L'avantage c'est qu'on pourra questionner cette map pour savoir si un événement est présent et
    // récupérer sa largeur
    const percentMap = new Map();

    percentMap.set(ActivationStart, 30);
    percentMap.set(GuardsCheckEnd, 50);
    percentMap.set(ResolveEnd, 85);
    percentMap.set(NavigationEnd, 100);

    // Ecoutons les événements du router
    this.router.events
      .pipe(
        // On commence par afficher la loading bar
        tap(() => (this.display = 'block')),
        // On attend 100ms pour que l'affichage soit visible
        delay(100),
        // On transforme l'objet event en son constructeur (le nom de la classe, exemple : ActivationStart)
        map((event) => event.constructor),
        // On regarde si l'événement est présent dans la map et quelle width est associée
        map((event) => percentMap.get(event)),
        // On filtre les événements qui n'ont pas de width associée
        // On n'ira pas plus loin si l'événement n'existe pas dans la map (par exemple NavigationStart)
        filter((width) => !!width),
        // On met à jour la largeur de la loading bar
        tap((width) => (this._width = width)),
        // On ne va pas plus loin si la largeur est inférieure à 100
        // au contraire, on va plus loin si on est arrivé à 100
        filter((width) => width === 100),
        // On attend 500ms pour que l'utilisateur puisse voir la loading bar à 100%
        delay(500)
      )
      .subscribe(() => {
        // On n'arrive ici que si on est à 100% et qu'on a attendu 500ms
        // On cache la loading bar
        this.display = 'none';
        // On remet la largeur à 0
        this._width = 0;
      });
  }
}
