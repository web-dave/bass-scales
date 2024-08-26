import { NgClass } from '@angular/common';
import {
  Component,
  Renderer2,
  Signal,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { SettingsService } from './settings.service';
import { debounceTime, delay, of, tap } from 'rxjs';

@Component({
  selector: 'bass-string',
  standalone: true,
  imports: [NgClass],
  template: `
    @for (note of notes(); track $index) {
      <!-- class="vibrate" -->
      <div
        class="note-fret"
        #noteFret
        [ngClass]="{
          'in-scale': isDotted($index),
          vibrate: playingNote() === frequencies()[$index],
        }"
        (mousedown)="playNote($index, noteFret)"
      ></div>
    }
  `,
})
export class BassStringComponent {
  name = input.required<'G' | 'D' | 'A' | 'E'>();
  fingers = input.required<number[]>();
  playingNote = input.required<number>();
  service = inject(SettingsService);
  private renderer = inject(Renderer2);
  activeFrequencies: number[] = [];
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
  playNote(i: number, elem: HTMLDivElement) {
    if (!this.isDotted(i)) {
      return;
    }
    // console.log(i);
    const freq = this.frequencies()[i];
    const osc = this.service.audioContext.createOscillator();
    osc.connect(this.service.mainGainNode);
    osc.type = 'sine';
    osc.frequency.value = freq;

    if (this.activeFrequencies.includes(freq)) {
      return;
    }

    // const noteFretElement = event.target as HTMLElement;
    this.renderer.addClass(elem, 'vibrate');

    of([osc, freq])
      .pipe(
        tap((data) => {
          const o = data[0] as OscillatorNode;
          this.activeFrequencies.push(data[1] as number);
          o.start();
          // console.log(i, 'start');
        }),
        delay(1000),
        tap((data) => {
          const o = data[0] as OscillatorNode;
          o.stop();
          const freqs = [...this.activeFrequencies];
          this.activeFrequencies = freqs.filter((f) => f !== data[1]);
          o.disconnect();
          this.renderer.removeClass(elem, 'vibrate');
          // console.log(i, 'stop');
        }),
      )
      .subscribe();
  }
}
