import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { SettingsService } from './settings.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, NgClass],
  template: `
    <bass-navigation [ngClass]="{ init: !service.mainGainNodeS() }" />
    <!-- <dialog [open]="!service.mainGainNodeS()"> -->

    @if (!service.mainGainNodeS()) {
      <div class="container">
        <div class="start" (click)="service.startAudio('bass')">Bass</div>
        <div class="start" (click)="service.startAudio('guitar')">Guitar</div>
      </div>
      <!-- <button (click)="service.startAudio()">Start Audio</button> -->
    }
    <!-- </dialog> -->
    <router-outlet />
  `,
  styles: `
    bass-navigation.init {
      margin-bottom: 50px;
      display: block;
    }
    .container {
      margin-top: 70px;
      display: flex;
      justify-content: center;
    }
    .start {
      height: 150px;
      width: 150px;
      border-radius: 50%;
      background-color: hotpink;
      margin: 30px;
      text-align: center;
      padding-top: 53px;
      padding-bottom: 50px;
      font-size: xx-large;
    }
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
      // console.log(voices[0]);
      // console.log(voices[107]);
      this.voice.set(voices[0]);
    };
  }
}
