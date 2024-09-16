import { Component, input, output } from '@angular/core';

@Component({
  selector: 'bass-scales',
  standalone: true,
  imports: [],
  template: `
    <div style="width:200px;">
      <select #scaleSelect (change)="scale.emit(scaleSelect.value)">
        @for (scale of scaleNames; track $index) {
          <option [value]="scale">{{ scale }}</option>
        }
      </select>
    </div>
  `,
})
export class ScalesComponent {
  scale = output<string>();
  scaleNames = [
    'ionian',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'aeolian',
    'locrian',
  ];
}
