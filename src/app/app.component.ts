import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <bass-navigation />
    <dialog [open]="!service.mainGainNodeS()">
      <button (click)="service.startAudio()">Start Audio</button>
    </dialog>
    <router-outlet />
    <hr />
  `,
})
export class AppComponent implements OnInit {
  recognition!: SpeechRecognition;
  speechRecognitionList!: SpeechGrammarList;
  service = inject(SettingsService);
  voice = inject(SettingsService).voice;

  steps = [1, 2, 3, 4, 5, 6, 0];
  grammar = `#JSGF V1.0; grammar colors; public <color> = ${this.steps.join(
    ' | ',
  )};`;

  ngOnInit(): void {
    speechSynthesis.onvoiceschanged = (event) => {
      const voices = speechSynthesis.getVoices();
      console.log(voices[0]);
      // console.log(voices[107]);
      this.voice.set(voices[0]);
    };
  }
}
