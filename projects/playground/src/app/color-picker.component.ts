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
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ColorPickerComponent,
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  @Input()
  label = 'Choisissez une couleur';

  @Input()
  color: 'blue' | 'red' | 'purple' = 'blue';

  select(color: 'blue' | 'red' | 'purple') {
    this.color = color;
    this.onChange(color);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.color = value as any;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
