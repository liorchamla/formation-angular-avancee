import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { RegisterComponent, RegisterFormType } from './register.component';

describe('RegisterComponent', () => {
  let spectator: Spectator<RegisterComponent>;
  let component: RegisterComponent;

  const createComponent = createComponentFactory({
    component: RegisterComponent,
    imports: [ReactiveFormsModule],
    mocks: [AuthService, Router],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    // On mock la méthode exists() de AuthService pour qu'elle retourne toujours true (sauf si dans un test
    // particulier on veut qu'elle retourne false)
    spectator.inject(AuthService).exists.and.returnValue(of(true));
  });

  it('should validate email', () => {
    // Vérification required
    spectator.typeInElement('', '#email');
    expect(component.email.invalid).toBeTrue();

    // Vérification format (email)
    spectator.typeInElement('test', '#email');
    expect(component.email.invalid).toBeTrue();

    // Vérification existing email
    spectator.inject(AuthService).exists.and.returnValue(of(true));
    spectator.typeInElement('test@test.com', '#email');
    expect(component.email.invalid).toBeTrue();

    // Vérification valid email
    spectator.inject(AuthService).exists.and.returnValue(of(false));
    spectator.typeInElement('test@test.com', '#email');
    expect(component.email.valid).toBeTrue();
  });

  it('should validate name', () => {
    // Verification required
    spectator.typeInElement('', '#name');
    expect(component.name.invalid).toBeTrue();

    // Verification minLength
    spectator.typeInElement('test', '#name');
    expect(component.name.invalid).toBeTrue();

    // Verification valid name
    spectator.typeInElement('testtest', '#name');
    expect(component.name.valid).toBeTrue();
  });

  it('should validate password', () => {
    // Verification required
    spectator.typeInElement('', '#password');
    expect(component.password.invalid).toBeTrue();

    // Verification minLength
    spectator.typeInElement('t3st', '#password');
    expect(component.password.invalid).toBeTrue();

    // Verification format
    spectator.typeInElement('testtest', '#password');
    expect(component.password.invalid).toBeTrue();

    // Verification valid password
    spectator.typeInElement('t3sttest', '#password');
    expect(component.password.valid).toBeTrue();
  });

  it('should validate confirPassword', () => {
    // Verification required
    spectator.typeInElement('', '#confirmPassword');
    expect(component.confirmPassword.invalid).toBeTrue();

    // Verification same as password
    spectator.typeInElement('t3sttest', '#password');
    spectator.typeInElement('t3st', '#confirmPassword');
    expect(component.registerForm.hasError('confirm')).toBeTrue();

    // Verification correct confirmation
    spectator.typeInElement('t3sttest', '#confirmPassword');
    expect(component.registerForm.hasError('confirm')).toBeFalse();
    expect(component.confirmPassword.valid).toBeTrue();
  });

  it('should redirect to / if register succeeds', () => {
    // On mock le AuthService pour simuler un succès de la requête HTTP :
    spectator.inject(AuthService).register.and.returnValue(of(null));

    // On simule le remplissage valide du formulaire :
    setupValidFormValue();

    // On vérifie que le router est bien appelé et redirige bien vers /
    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not redirect if register fails', () => {
    // On mock le AuthService pour simuler un échec de la requête HTTP :
    spectator
      .inject(AuthService)
      .register.and.returnValue(throwError(() => null));

    // On simule le remplissage valide du formulaire :
    setupValidFormValue();

    // On vérifie que le router est bien appelé et redirige bien vers /
    expect(spectator.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('should show an error message if register fails', () => {
    // On mock le AuthService pour simuler un échec de la requête HTTP :
    spectator
      .inject(AuthService)
      .register.and.returnValue(throwError(() => null));

    // On simule le remplissage valide du formulaire :
    setupValidFormValue();

    // On vérifie que le router est bien appelé et redirige bien vers /
    expect(spectator.query('.alert.bg-warning')).toExist();
  });

  const setupValidFormValue = () => {
    // Et pour que le formulaire soit valide, il faut que l'email ne soit pas déjà utilisé
    spectator.inject(AuthService).exists.and.returnValue(of(false));

    // On met en place les bonnes valeurs pour un formulaire valide
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'jd@mail.com',
      password: 't3sttest',
      confirmPassword: 't3sttest',
    });

    // On déclenche la soumission
    spectator.click('button');
  };
});
