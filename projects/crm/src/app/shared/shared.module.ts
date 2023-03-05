import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TOKEN_MANAGER } from '../auth/jwt/token.manager';
import { LocalStorageTokenManager } from '../auth/jwt/local-storage';

/**
 * Le SharedModule est l'endroit parfait pour exposer les composants, directives et services qui sont utilisés partout dans l'application
 */

@NgModule({
  declarations: [AuthenticatedDirective],
  exports: [AuthenticatedDirective],
  imports: [CommonModule, HttpClientModule],
  providers: [
    AuthService,
    {
      // On explique que tous ceux qui veulent un TokenManager recevront de la part du système d'injection de dépendances
      // un LocalStorageTokenManager. Si à l'avenir on change de stratégie (par exemple pour utiliser un
      // sessionStorage), on n'aura qu'à changer ce qui est fourni ici
      provide: TOKEN_MANAGER,
      useClass: LocalStorageTokenManager,
    },
  ],
})
export class SharedModule {}
