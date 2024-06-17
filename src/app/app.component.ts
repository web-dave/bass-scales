import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { fromEvent, merge } from 'rxjs';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: ` <bass-navigation></bass-navigation>
    <router-outlet />`,
})
export class AppComponent implements OnInit {
  recognition!: SpeechRecognition;
  speechRecognitionList!: SpeechGrammarList;

  voice = inject(SettingsService).voice;

  steps = [1, 2, 3, 4, 5, 6, 0];
  grammar = `#JSGF V1.0; grammar colors; public <color> = ${this.steps.join(
    ' | ',
  )};`;

  router = inject(Router);

  ngOnInit(): void {
    speechSynthesis.onvoiceschanged = (event) => {
      const voices = speechSynthesis.getVoices();
      // console.log(voices);
      // console.log(voices[107]);
      this.voice.set(voices[0]);
    };
  }
}
