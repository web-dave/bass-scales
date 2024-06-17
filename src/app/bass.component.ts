import {
  Component,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { BassStringComponent } from './bass-string.component';
import { ScalesComponent } from './scales.component';
import { SettingsService } from './settings.service';
import { Subject, interval, map, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'bass-fretboard',
  standalone: true,
  imports: [ScalesComponent, BassStringComponent],
  template: `
    <div class="fretboard">
      @for (string of strings; track $index) {
        <!-- {{ scales[scale()][$index] }} -->
        <bass-string
          class="string"
          [name]="string"
          [fingers]="scales[scale()][$index]"
        />
      }
    </div>
    <input type="range" name="" id="" />
    <button (click)="play()">play</button>
    <button (click)="kill$$.next(1)">stop</button>
  `,
})
export class BassComponent {
  service = inject(SettingsService);
  sound = this.service.sound.asReadonly();
  voice = this.service.voice.asReadonly();
  scale = input.required<string>();
  strings: ['G', 'D', 'A', 'E'] = ['G', 'D', 'A', 'E'];
  kill$$ = new Subject<number>();
  noteFrequenzes: Signal<number[]> = computed(() => {
    this.scale();
    return [];
  });
  scales = this.service.scales;

  scaleFrequencies: number[] = [];
  oscillators: OscillatorNode[] = [];

  eRef = effect(() => {
    if (this.scale() && this.voice() && this.sound()) {
      const fingersVoice = [...this.scales[this.scale()]]
        .reverse()
        .flat()
        .join('     ');

      console.log(fingersVoice);
      let utterance = new SpeechSynthesisUtterance(fingersVoice);
      utterance.voice = this.voice() as SpeechSynthesisVoice;
      utterance.pitch = 1.3;
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  });

  scaleEffect = effect(() => {
    if (this.scale()) {
      const frequencies = this.service.frequencies;
      this.scaleFrequencies = [...this.scales[this.scale()]]
        .map((string, i_string) => {
          const stringName: 'G' | 'D' | 'A' | 'E' = ['G', 'D', 'A', 'E'][
            i_string
          ] as 'G' | 'D' | 'A' | 'E';
          return string.map((i) => frequencies[stringName][i]);
        })
        .reverse()
        .flat();
      console.log(this.scaleFrequencies);
      // this.oscillators = this.scaleFrequencies.map((f) => {
      //   const osc = this.service.audioContext.createOscillator();
      //   osc.connect(this.service.mainGainNode);
      //   osc.type = 'sine';
      //   osc.frequency.value = f;
      //   return osc;
      // });
    }
  });
  loopI = -1;
  play() {
    interval(1000)
      .pipe(
        map((i) => {
          this.loopI++;
          if (this.loopI >= 12) {
            this.loopI = 0;
          }
          return this.loopI;
        }),
        takeUntil(this.kill$$),
        tap((i) => console.log('i', i)),
        map((i) => this.scaleFrequencies[i]),
        tap((f) => console.log('f', f)),
        map((f) => {
          const osc = this.service.audioContext.createOscillator();
          osc.connect(this.service.mainGainNode);
          osc.type = 'sine';
          osc.frequency.value = f;
          return osc;
        }),
        tap((osc) => {
          if (osc) {
            osc.start();
            setTimeout(() => {
              osc.stop();
            }, 500);
          }
        }),
      )
      .subscribe();
  }
}
