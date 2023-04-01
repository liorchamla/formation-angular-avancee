import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoiceCreationComponent } from './invoice-creation/invoice-creation.component';
import { InvoiceEditionComponent } from './invoice-edition/invoice-edition.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceFormGeneralComponent } from './invoice-form/invoice-form-general.component';
import { InvoiceFormDetailsComponent } from './invoice-form/invoice-form-details.component';
import { InvoiceFormTotalsComponent } from './invoice-form/invoice-form-totals.component';
import localeFr from '@angular/common/locales/fr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InvoiceService } from './invoice.service';
import { AuthInterceptor } from './auth.interceptor';
import { InvoiceStatusComponent } from './invoices-list/invoice-status.component';

// Nous enregistrons auprès de Angular la locale fr (elle sera utile pour les pipes de date ou de montant !)
registerLocaleData(localeFr);

const routes: Routes = [
  { path: '', component: InvoicesListComponent },
  { path: 'create', component: InvoiceCreationComponent },
  { path: ':id', component: InvoiceEditionComponent },
];

@NgModule({
  declarations: [
    InvoicesListComponent,
    InvoiceCreationComponent,
    InvoiceEditionComponent,
    InvoiceFormComponent,
    InvoiceFormGeneralComponent,
    InvoiceFormDetailsComponent,
    InvoiceFormTotalsComponent,
    InvoiceStatusComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    // Nous déclarons auprès de l'injecteur du InvoiceModule qu'il pourra fournir une instance de InvoiceService
    // à tous ceux qui en ont besoin dans ce module
    InvoiceService,
    // Nous déclarons auprès de l'injecteur du InvoiceModule qu'il pourra fournir une instance de AuthInterceptor
    AuthInterceptor,
    // Enfin, nous déclarons que AuthInterceptor doit être utilisé pour intercepter les requêtes HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class InvoiceModule {}
