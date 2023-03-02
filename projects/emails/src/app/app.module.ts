import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './user/auth.service';
import { AuthGuard } from './user/auth.guard';
import { LoadingBarComponent } from './loading-bar.component';

/**
 * Désormais, les routes de mes différents affichages sont des lazy loadings de feature modules
 * Cela me permet de charger uniquement les modules dont j'ai besoin et donc d'augmenter les performances
 * en évitant de charger des modules qui ne seront peut-être jamais utilisés
 */
const routes: Routes = [
  {
    path: 'account',
    // On demande à charger dynamiquement le fichier user.module.ts
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },

  {
    path: 'messages',
    // On charge le AuthGuard de garder l'accès à cette route en fonction de l'état de l'authentification
    canActivate: [AuthGuard],
    // On demande à charger dynamiquement le fichier email.module.ts
    loadChildren: () =>
      import('./email/email.module').then((m) => m.EmailModule),
  },
];

@NgModule({
  declarations: [AppComponent, LoadingBarComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
