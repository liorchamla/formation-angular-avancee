import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { InscriptionComponent } from './inscription.component';
import { BannedEmailValidator } from './banned-email-validator.directive';
import { UniqueEmailValidator } from './unique-email-validator.directive';
import { ConfirmPasswordValidator } from './confirm-password-validator.directive';
import { ColorPickerComponent } from './color-picker.component';
import { ReactiveInscriptionComponent } from './reactive-inscription.component';
import { RecipeComponent } from './recipe.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveInscriptionComponent,
    InscriptionComponent,
    BannedEmailValidator,
    UniqueEmailValidator,
    ConfirmPasswordValidator,
    ColorPickerComponent,
    RecipeComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
