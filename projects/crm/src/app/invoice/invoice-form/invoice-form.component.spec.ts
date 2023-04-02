import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  createComponentFactory,
  createHostFactory,
  Spectator,
  SpectatorHost,
} from '@ngneat/spectator';
import { Invoice, InvoiceFormType } from '../types';
import { InvoiceFormDetailsComponent } from './invoice-form-details.component';
import { InvoiceFormGeneralComponent } from './invoice-form-general.component';
import { InvoiceFormTotalsComponent } from './invoice-form-totals.component';
import { InvoiceFormComponent } from './invoice-form.component';

/**
 * Voici l'ensemble des tests pour le InvoiceFormComponent :
 * - Les tests unitaires pour le composant sans host
 * - Les tests unitaires pour le composant avec host
 * -- Avec un @Input
 * -- Avec un @Output
 *
 */
describe('InvoiceFormComponent', () => {
  /**
   * Voici les tests unitaires du composant, on ne se soucis ni de l'@Output ni de l'@Input
   */
  describe('Without Host', () => {
    let spectator: Spectator<InvoiceFormComponent>;
    let component: InvoiceFormComponent;
    let form: InvoiceFormType;

    const createSpectator = createComponentFactory({
      component: InvoiceFormComponent,
      declarations: [
        InvoiceFormDetailsComponent,
        InvoiceFormTotalsComponent,
        InvoiceFormGeneralComponent,
      ],
      imports: [ReactiveFormsModule],
    });

    beforeEach(() => {
      spectator = createSpectator();
      component = spectator.component;
      form = component.invoiceForm;
    });

    /**
     * Gestion des validations des champs du formulaire
     */
    describe('Inputs validations', () => {
      it('should validate customer_name input', () => {
        spectator.typeInElement('', '#customer_name');
        expect(form.controls.customer_name.hasError('required')).toBeTrue();

        spectator.typeInElement('John', '#customer_name');
        expect(form.controls.customer_name.hasError('minlength')).toBeTrue();

        spectator.typeInElement('John Doe', '#customer_name');
        expect(form.controls.customer_name.valid).toBeTrue();
      });

      it('should validate description input', () => {
        spectator.typeInElement('', '#description');
        expect(form.controls.description.hasError('required')).toBeTrue();

        spectator.typeInElement('Hello', '#description');
        expect(form.controls.description.hasError('minlength')).toBeTrue();

        spectator.typeInElement('Hello World !', '#description');
        expect(form.controls.description.valid).toBeTrue();
      });

      it('should validate details', () => {
        expect(form.controls.details.hasError('noEmptyDetails')).toBeTrue();

        component.onAddDetail();

        spectator.detectChanges();

        expect(form.controls.details.hasError('noEmptyDetails')).toBeFalse();
        expect(form.controls.details.invalid).toBeTrue();

        spectator.typeInElement('Hello World !', '#description_0');
        spectator.typeInElement('10', '#quantity_0');
        spectator.typeInElement('10', '#amount_0');

        expect(form.controls.details.valid).toBeTrue();
      });
    });

    // Gestion de l'ajout d'une ligne de détail
    it('should add a new detail when we call onAddDetail()', () => {
      component.onAddDetail();

      spectator.detectChanges();

      expect(spectator.queryAll('.detail-row')).toHaveLength(1);

      component.onAddDetail();

      spectator.detectChanges();

      expect(spectator.queryAll('.detail-row')).toHaveLength(2);
    });

    // Gestion de la suppression d'une ligne de détail
    it('should remove a detail when we call onRemoveDetail(number)', () => {
      component.onAddDetail();
      component.onAddDetail();

      spectator.detectChanges();

      expect(spectator.queryAll('button[id^="remove-detail-"]')).toHaveLength(
        2
      );

      component.onRemoveDetail(1);

      spectator.detectChanges();

      expect(spectator.queryAll('.detail-row')).toHaveLength(1);

      component.onRemoveDetail(0);

      spectator.detectChanges();

      expect(spectator.queryAll('.detail-row')).toHaveLength(0);
    });

    // Gestion des totaux
    it('should calculate total with details', () => {
      form.controls.details.push(
        new FormGroup({
          amount: new FormControl(10),
          quantity: new FormControl(10),
          description: new FormControl(),
        })
      ); // 10x10 = 100

      form.controls.details.push(
        new FormGroup({
          amount: new FormControl(5),
          quantity: new FormControl(5),
          description: new FormControl(),
        })
      ); // 5x5 = 25

      expect(component.total).toBe(125);
    });
  });

  /**
   * Voici les tests unitaires du composant avec host et un @Output
   * Le but est de s'assurer que l'@Output est bien émis lorsqu'on soumet le formulaire
   */
  describe('In Host with @Output', () => {
    let spectator: SpectatorHost<InvoiceFormComponent, HostComponent>;
    let submitSpy: jasmine.Spy;

    @Component({})
    class HostComponent {
      onSubmit(invoice: Invoice) {}
    }

    const createSpectator = createHostFactory({
      component: InvoiceFormComponent,
      host: HostComponent,
      declarations: [
        InvoiceFormDetailsComponent,
        InvoiceFormTotalsComponent,
        InvoiceFormGeneralComponent,
      ],
      imports: [ReactiveFormsModule],
      template: `<app-invoice-form (form-submit)="onSubmit($event)"></app-invoice-form>`,
    });

    beforeEach(() => {
      spectator = createSpectator();
      submitSpy = spyOn(spectator.hostComponent, 'onSubmit');
    });

    it('should not emit (form-submit) event if the form is invalid', () => {
      spectator.click('#submit');

      expect(submitSpy).not.toHaveBeenCalled();
    });

    it('should emit a (form-submit) event if the form is valid', () => {
      spectator.typeInElement('MOCK_DESCRIPTION', '#description');
      spectator.typeInElement('John Doe', '#customer_name');

      spectator.click('#add-detail-initial');

      spectator.typeInElement('10', '#quantity_0');
      spectator.typeInElement('10', '#amount_0');
      spectator.typeInElement('Hello World !', '#description_0');

      spectator.click('#submit');

      expect(submitSpy).toHaveBeenCalledWith({
        description: 'MOCK_DESCRIPTION',
        customer_name: 'John Doe',
        status: 'SENT',
        details: [
          {
            amount: 10,
            quantity: 10,
            description: 'Hello World !',
          },
        ],
      } as Invoice);
    });
  });

  /**
   * Voici les tests unitaires du composant avec host et un @Input
   * Le but est de s'assurer que le formulaire est bien rempli avec les données passées en @Input
   */
  describe('In Host with @Input', () => {
    let spectator: SpectatorHost<InvoiceFormComponent>;
    const MOCK_INVOICE: Invoice = {
      description: 'MOCK_DESCRIPTION',
      customer_name: 'John Doe',
      status: 'PAID',
      details: [
        {
          amount: 10,
          quantity: 10,
          description: 'Hello World !',
        },
      ],
    };

    const createSpectator = createHostFactory({
      component: InvoiceFormComponent,
      declarations: [
        InvoiceFormDetailsComponent,
        InvoiceFormTotalsComponent,
        InvoiceFormGeneralComponent,
      ],
      imports: [ReactiveFormsModule],
      template: `<app-invoice-form [invoice]="invoice"></app-invoice-form>`,
    });

    it('should fill the form with [invoice] Input', () => {
      spectator = createSpectator(undefined, {
        hostProps: { invoice: MOCK_INVOICE },
      });

      expect(spectator.query('#description')).toHaveValue('MOCK_DESCRIPTION');
      expect(spectator.query('#customer_name')).toHaveValue('John Doe');
      expect(spectator.query('#status')).toHaveValue('PAID');
      expect(spectator.query('#description_0')).toHaveValue('Hello World !');
      expect(spectator.query('#quantity_0')).toHaveValue('10');
      expect(spectator.query('#amount_0')).toHaveValue('10');
    });
  });
});
