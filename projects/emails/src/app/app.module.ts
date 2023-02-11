import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RegisterComponent } from './user/register.component';
import { LoginComponent } from './user/login.component';
import { EmailsComponent } from './email/emails.component';
import { EmailsListComponent } from './email/emails-list.component';
import { EmailDetailsComponent } from './email/email-details.component';
import { EmailCreationComponent } from './email/email-creation.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'account/register', component: RegisterComponent },
  { path: 'account/login', component: LoginComponent },
  {
    path: 'emails',
    component: EmailsComponent,
    children: [
      { path: '', component: EmailsListComponent },
      { path: 'create', component: EmailCreationComponent },
      { path: 'read/:id', component: EmailDetailsComponent },
      { path: ':type', component: EmailsListComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    EmailsComponent,
    EmailsListComponent,
    EmailDetailsComponent,
    EmailCreationComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
