import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BannedEmailValidator } from './banned-email-validator.directive';
import { UniqueEmailValidator } from './unique-email-validator.directive';
import { ConfirmPasswordValidator } from './confirm-password-validator.directive';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    BannedEmailValidator,
    UniqueEmailValidator,
    ConfirmPasswordValidator,
    ColorPickerComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
