import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[authenticated]',
})
export class AuthenticatedDirective implements OnInit, OnDestroy {
  @Input('authenticated') value = true;

  authSubscription?: Subscription;

  ngOnInit() {
    // On s'inscrit de telle sorte qu'on soit au courant à chaque fois que le authStatus change
    this.authSubscription = this.auth.authStatus$.subscribe((status) => {
      // A chaque fois, on vide le container
      this.container.clear();

      // Si le status d'authentification est le même que celui qui est demandé par la directive
      // alors on affiche le template
      if (status === this.value) {
        this.container.createEmbeddedView(this.template);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  constructor(
    // L'élément qu'on cherche à cacher / afficher
    private template: TemplateRef<HTMLElement>,
    // L'endroit dans lequel il doit être caché / affiché
    private container: ViewContainerRef,
    private auth: AuthService
  ) {}
}
