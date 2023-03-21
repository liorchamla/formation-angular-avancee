import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { InvoiceFormDetailsComponent } from './invoice-form-details.component';

@Component({})
class HostComponent {
  onAdd() {}
  onRemove(index: number) {}

  form = new FormGroup({
    details: new FormArray([
      new FormGroup({
        quantity: new FormControl(2),
        description: new FormControl('MOCK_DESCRIPTION_1'),
        amount: new FormControl(100),
      }),
      new FormGroup({
        quantity: new FormControl(5),
        description: new FormControl('MOCK_DESCRIPTION_2'),
        amount: new FormControl(200),
      }),
    ]),
  });
}

describe('InvoiceFormDetailsComponent', () => {
  let spectator: SpectatorHost<InvoiceFormDetailsComponent, HostComponent>;

  const createSpectator = createHostFactory({
    component: InvoiceFormDetailsComponent,
    host: HostComponent,
    template: `<app-invoice-form-details [parent]="form" (add-detail)="onAdd()" (remove-detail)="onRemove($event)"></app-invoice-form-details>`,
    imports: [ReactiveFormsModule],
  });

  it("should report user's updates to parent form", () => {
    spectator = createSpectator();

    spectator.typeInElement('UPDATED_DESCRIPTION_1', '#description_0');
    spectator.typeInElement('12', '#quantity_0');
    spectator.typeInElement('300', '#amount_0');

    spectator.typeInElement('UPDATED_DESCRIPTION_2', '#description_1');
    spectator.typeInElement('15', '#quantity_1');
    spectator.typeInElement('400', '#amount_1');

    expect(spectator.hostComponent.form.value).toEqual({
      details: [
        {
          quantity: 12,
          description: 'UPDATED_DESCRIPTION_1',
          amount: 300,
        },
        {
          quantity: 15,
          description: 'UPDATED_DESCRIPTION_2',
          amount: 400,
        },
      ],
    });
  });

  it("should emit an event when user clicks on 'add' or 'add-initial' button", () => {
    spectator = createSpectator();

    const addSpy = spyOn(spectator.hostComponent, 'onAdd');

    spectator.click('#add-detail');

    expect(addSpy).toHaveBeenCalled();

    spectator.hostComponent.form.controls.details.removeAt(0);
    spectator.hostComponent.form.controls.details.removeAt(0);

    spectator.detectChanges();

    spectator.click('#add-detail-initial');

    expect(addSpy).toHaveBeenCalled();
  });

  it("should emit an event when user clicks on 'add' or 'add-initial' button", () => {
    spectator = createSpectator();

    const removeSpy = spyOn(spectator.hostComponent, 'onRemove');

    spectator.click('#remove-detail-0');

    expect(removeSpy).toHaveBeenCalledWith(0);
  });

  it('should display a welcome message with a button to add first details', () => {
    spectator = createSpectator(undefined, {
      hostProps: {
        form: new FormGroup({
          details: new FormArray<FormGroup>([]),
        }),
      },
    });

    expect(spectator.query('.alert.bg-warning')).toExist();
    expect(spectator.query('#add-detail-initial')).toExist();
  });
});
