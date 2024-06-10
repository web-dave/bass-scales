import { Component, OnInit, effect, input, signal } from '@angular/core';
import { BassStringComponent } from './bass-string.component';
import { ScalesComponent } from './scales.component';

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
  `,
})
export class BassComponent implements OnInit {
  scale = input.required<string>();
  strings = ['G', 'D', 'A', 'E'];
  voice: any;
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

  ngOnInit(): void {
    speechSynthesis.onvoiceschanged = (event) => {
      const voices = speechSynthesis.getVoices();
      // console.log(voices);
      // console.log(voices[107]);
      this.voice = voices[107];
    };
  }

  eRef = effect(() => {
    if (this.scale() && this.voice) {
      const fingersVoice = [...this.scales[this.scale()]]
        .reverse()
        .flat()
        .join('     ');

      console.log(fingersVoice);
      let utterance = new SpeechSynthesisUtterance(fingersVoice);
      utterance.voice = this.voice;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  });
}
