import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;
  let component: LoginComponent;

  const createComponent = createComponentFactory({
    component: LoginComponent,
    imports: [ReactiveFormsModule],
    mocks: [AuthService, Router],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should validate email', () => {
    // Vérification required
    spectator.typeInElement('', '#email');
    expect(component.email.invalid).toBeTrue();

    // Vérification format (email)
    spectator.typeInElement('test', '#email');
    expect(component.email.invalid).toBeTrue();

    // Vérification valid email
    spectator.typeInElement('john@doe.com', '#email');
    expect(component.email.valid).toBeTrue();
  });

  it('should validate password', () => {
    // Verification required
    spectator.typeInElement('', '#password');
    expect(component.password.invalid).toBeTrue();

    // Verification minLength
    spectator.typeInElement('test', '#password');
    expect(component.password.invalid).toBeTrue();

    // Verification valid password
    spectator.typeInElement('t3sttest', '#password');
    expect(component.password.valid).toBeTrue();
  });

  it('should redirect to / if login succeeds', () => {
    // On simule le fait que la requête HTTP se passe bien :
    spectator.inject(AuthService).login.and.returnValue(of({}));

    // On rempli le formulaire et on le soumet
    component.loginForm.setValue({
      email: 'john@doe.com',
      password: 't3sttest',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not redirect to / if login fails', () => {
    // On simule le fait que la requête HTTP se passe bien :
    spectator.inject(AuthService).login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Invalid credentials',
          })
      )
    );

    // On rempli le formulaire et on le soumet
    component.loginForm.setValue({
      email: 'john@doe.com',
      password: 't3sttest',
    });

    spectator.click('button');

    expect(spectator.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('should display error message if login fails', () => {
    // On simule le fait que la requête HTTP se passe bien :
    spectator.inject(AuthService).login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Invalid credentials',
          })
      )
    );

    // On rempli le formulaire et on le soumet
    component.loginForm.setValue({
      email: 'john@doe.com',
      password: 't3sttest',
    });

    spectator.click('button');

    expect(spectator.query('.alert.bg-warning')).toExist();
  });
});
