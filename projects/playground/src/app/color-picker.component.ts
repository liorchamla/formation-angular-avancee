import { Component, Input, OnInit } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  template: `
    <label>{{ label }}</label>
    <ul>
      <li
        (click)="select('blue')"
        [class.selected]="color === 'blue'"
        [style.backgroundColor]="'blue'"
      ></li>
      <li
        (click)="select('red')"
        [class.selected]="color === 'red'"
        [style.backgroundColor]="'red'"
      ></li>
      <li
        (click)="select('purple')"
        [class.selected]="color === 'purple'"
        [style.backgroundColor]="'purple'"
      ></li>
    </ul>
  `,
  styles: [
    `
      ul {
        list-style: none;
        display: flex;
        gap: 1rem;
        padding: 0;
      }

      li.selected {
        border: 5px solid rgba(255, 255, 255, 0.5);
      }

      li {
        width: 50px;
        height: 50px;
        padding: 0;
        background-color: red;
        cursor: pointer;
        border-radius: 5px;
      }
    `,
  ],
  providers: [
    /**
     * Quand on placera une directive ngModel ou formControl sur notre composant,
     * ces directives vont demander au système d'injection de dépendances : "y a-t-il un value accessor pour ce type de champ ?"
     *
     * En l'occurence, notre composant est un value accessor lui-même ! Il faut l'inscrire dans le système d'injection de dépendances
     * grâce au jeton NG_VALUE_ACCESSOR.
     */
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorPickerComponent,
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  // onChange est une fonction qui APPARTIENT au NgModel ou au FormControl
  // il faudra qu'on l'appelle pour le prévenir le NgModel ou le FormControl que la valeur a changé
  onChange: (value: string) => void = () => {};
  // onTouched est une fonction qui APPARTIENT au NgModel ou au FormControl
  // il faudra qu'on l'appelle pour le prévenir le NgModel ou le FormControl que le champ a été touché
  onTouched: () => void = () => {};

  @Input()
  label = 'Choisissez une couleur';

  @Input()
  color: 'blue' | 'red' | 'purple' = 'blue';

  /**
   * Cette fonction sera appelée au click sur une couleur
   */
  select(color: 'blue' | 'red' | 'purple') {
    // On changera donc la propriété color
    this.color = color;
    // Et on préviendra NgModel ou FormControl que la valeur a changé
    this.onChange(color);
    // Et on préviendra NgModel ou FormControl que le champ a été touché
    this.onTouched();
  }

  // Cette méthode sera appelée par NgModel ou FormControl pour modifier la valeur
  // de notre composant
  writeValue(value: string): void {
    this.color = value as any;
  }

  // NgModel ou FormControl vont appeler cette méthode pour nous donner
  // la fonction qu'il faudra appeler lorsque la valeur va changer
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // NgModel ou FormControl vont appeler cette méthode pour nous donner
  // la fonction qu'il faudra appeler lorsque le champ va être touché
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
