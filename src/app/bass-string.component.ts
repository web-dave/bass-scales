import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'bass-string',
  standalone: true,
  imports: [NgClass],
  template: `
    @for (note of notes(); track $index) {
      <div class="note-fret" [ngClass]="{ 'in-scale': isDotted($index) }"></div>
    }
  `,
})
export class BassStringComponent {
  string = input.required<string>();
  fingers = input.required<number[]>();

  allNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  start = computed(() => this.allNotes.indexOf(this.string()));

  notes = computed(() => {
    const index = this.allNotes.indexOf(this.string());
    const start = this.allNotes.slice(index);
    const end = this.allNotes.slice(0, index);
    return [...start, ...end].slice(0, 5);
  });

  isDotted(i: number) {
    return this.fingers().includes(i);
  }
}
