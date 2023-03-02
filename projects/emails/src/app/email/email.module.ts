import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EmailCreationComponent } from './email-creation.component';
import { EmailDetailsComponent } from './email-details.component';
import { EmailsListComponent } from './emails-list.component';
import { EmailsComponent } from './emails.component';
import { EmailsResolver } from './emails.resolver';
import { FormGuard } from './form.guard';
import { TitleResolver } from './title.resolver';

const routes: Routes = [
  {
    path: '',
    component: EmailsComponent,
    children: [
      {
        path: '',
        component: EmailsListComponent,
        resolve: {
          emails: EmailsResolver,
          title: TitleResolver,
        },
      },
      {
        path: 'create',
        component: EmailCreationComponent,
        canDeactivate: [FormGuard],
      },
      { path: 'read/:id', component: EmailDetailsComponent },
      {
        path: ':type',
        component: EmailsListComponent,
        resolve: {
          emails: EmailsResolver,
          title: TitleResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  declarations: [
    EmailCreationComponent,
    EmailsListComponent,
    EmailDetailsComponent,
    EmailsComponent,
  ],
  providers: [FormGuard, TitleResolver, EmailsResolver],
  exports: [],
})
export class EmailModule {}
