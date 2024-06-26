import { NgClass } from '@angular/common';
import { Component, Signal, computed, inject, input } from '@angular/core';
import { SettingsService } from './settings.service';
import { debounceTime, delay, of, tap } from 'rxjs';

@Component({
  selector: 'bass-string',
  standalone: true,
  imports: [NgClass],
  template: `
    @for (note of notes(); track $index) {
      <div
        class="note-fret"
        [ngClass]="{ 'in-scale': isDotted($index) }"
        (mousedown)="playNote($index)"
      ></div>
    }
  `,
})
export class BassStringComponent {
  name = input.required<'G' | 'D' | 'A' | 'E'>();
  fingers = input.required<number[]>();
  service = inject(SettingsService);
  // oscillators = this.service.oscillators;
  frequencies = computed(() => {
    if (this.name()) {
      return this.service.frequencies[this.name()];
    } else return [];
  });
  allNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  start = computed(() => this.allNotes.indexOf(this.name()));

  notes = computed(() => {
    const index = this.allNotes.indexOf(this.name());
    const start = this.allNotes.slice(index);
    const end = this.allNotes.slice(0, index);
    return [...start, ...end].slice(0, 5);
  });

  oscillators: Signal<OscillatorNode[]> = computed(() => {
    const list: OscillatorNode[] = this.frequencies().map((f) => {
      const osc = this.service.audioContext.createOscillator();
      osc.connect(this.service.mainGainNode);
      osc.type = 'sine';
      osc.frequency.value = f;
      return osc;
    });
    return list;
  });

  isDotted(i: number) {
    return this.fingers().includes(i);
  }
  playNote(i: number) {
    console.log(i);
    const osc = this.oscillators()[i];
    of(osc)
      .pipe(
        tap((o) => {
          o.start();
          console.log(i, 'start');
        }),
        delay(1000),
        tap((o) => {
          o.stop();
          console.log(i, 'stop');
        }),
      )
      .subscribe();
  }
}
