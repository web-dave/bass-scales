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
import { JsonPipe, NgClass } from '@angular/common';
import { IString } from './allnotes';

@Component({
  selector: 'bass-fretboard',
  standalone: true,
  imports: [ScalesComponent, BassStringComponent, JsonPipe, NgClass],
  template: `
    <div class="fretboard">
      @for (string of strings; track $index) {
        <bass-string
          class="string"
          [ngClass]="{
            bass: service.instrument() == 'bass',
            guitar: service.instrument() == 'guitar',
          }"
          [name]="string"
          [instrument]="service.instrument()"
          [playingNote]="playingNote"
          [fingers]="scales[scale()][$index]"
        />
      }
    </div>
  `,
})
export class BassComponent {
  service = inject(SettingsService);
  sound = this.service.sound.asReadonly();
  voice = this.service.voice.asReadonly();
  scale = input.required<string>();
  kill$$ = new Subject<number>();
  noteFrequenzes: Signal<number[]> = computed(() => {
    this.scale();
    return [];
  });
  scales = this.service.scales;
  strings = this.service.strings;

  synth = window.speechSynthesis;
  fingersVoice: string = '';

  playingNote = 0;

  error: any = '';

  scaleFrequencies: number[] = [];
  oscillators: OscillatorNode[] = [];

  eRef = effect(() => {
    if (
      this.scale() &&
      this.voice() &&
      this.sound() &&
      this.service.audioInitialized
    ) {
      this.fingersVoice = [...this.scales[this.scale()]]
        .reverse()
        .flat()
        .join('     ');

      // console.log(this.fingersVoice);
    }
  });

  controlsEffect = effect(() => {
    const cmd = this.service.controls();
    switch (this.service.controls()) {
      case 'speak':
        this.speak();
        break;
      case 'play':
        this.play();
        break;
      case 'stop':
        this.kill$$.next(1);
        break;

      default:
        break;
    }
  });

  scaleEffect = effect(() => {
    if (this.scale()) {
      const frequencies = this.service.frequencies;
      this.scaleFrequencies = [...this.scales[this.scale()]]
        .map((string, i_string) => {
          const stringName: IString = this.strings[i_string] as IString;
          return string.map((i) => frequencies[stringName][i]);
        })
        .reverse()
        .flat();
    }
  });

  loopI = -1;
  play() {
    this.loopI = -1;
    interval(1000)
      .pipe(
        map((i) => {
          this.loopI++;
          if (this.loopI >= this.scaleFrequencies.length) {
            this.loopI = 0;
          }
          return this.loopI;
        }),
        takeUntil(this.kill$$),
        map((i) => this.scaleFrequencies[i]),
        map((f) => {
          this.playingNote = f;
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

              this.playingNote = 0;
            }, 500);
          }
        }),
      )
      .subscribe();
  }

  speak() {
    let utterance = new SpeechSynthesisUtterance(this.fingersVoice);
    utterance.onerror = (err) => {
      console.log('ERROR!!!', err);
      this.error = err;
    };
    utterance.voice = this.voice() as SpeechSynthesisVoice;
    utterance.pitch = 1.3;
    utterance.rate = 0.7;
    this.synth.speak(utterance);
  }
}
