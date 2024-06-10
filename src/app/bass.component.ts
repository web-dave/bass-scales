import { Component, input, signal } from '@angular/core';
import { BassStringComponent } from './bass-string.component';
import { ScalesComponent } from './scales.component';

@Component({
  selector: 'bass-fretboard',
  standalone: true,
  imports: [ScalesComponent, BassStringComponent],
  template: `
    <div class="fretboard">
      @for (string of strings; track $index) {
        <bass-string
          class="string"
          [string]="string"
          [fingers]="scales[scale()][$index]"
        />
      }
    </div>
  `,
})
export class BassComponent {
  scale = input.required<string>();
  strings = ['G', 'D', 'A', 'E'];
  scales: { [key: string]: number[][] } = {
    ionisch: [
      [1, 2, 4],
      [1, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
    ],
    dorisch: [
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 3],
    ],
    phrysisch: [
      [0, 2, 4],
      [0, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
    ],
    lydisch: [
      [1, 3, 4],
      [1, 2, 4],
      [1, 2, 4],
      [0, 2, 4],
    ],
    mixolydisch: [
      [1, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
    ],
    aeolisch: [
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 3],
      [0, 2, 3],
    ],
    lokrisch: [
      [1, 3, 4],
      [1, 3, 4],
      [1, 2, 4],
      [1, 2, 4],
    ],
  };
}
