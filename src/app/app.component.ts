import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { fromEvent, merge } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: ` <bass-navigation></bass-navigation>
    <!-- <button (click)="speak()">speech</button> -->
    <!-- <button (click)="startRecognition()">Recognition</button> -->
    <router-outlet />`,
})
export class AppComponent implements OnInit {
  recognition!: SpeechRecognition;
  speechRecognitionList!: SpeechGrammarList;

  steps = [1, 2, 3, 4, 5, 6, 0];
  grammar = `#JSGF V1.0; grammar colors; public <color> = ${this.steps.join(
    ' | ',
  )};`;

  router = inject(Router);

  voice: any;
  ngOnInit(): void {
    this.recognition = new window.webkitSpeechRecognition();
    this.speechRecognitionList = new webkitSpeechGrammarList();
    this.speechRecognitionList.addFromString(this.grammar, 1);
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 8;
    const result$ = fromEvent<SpeechRecognitionEvent>(
      this.recognition,
      'result',
    );
    const nomatch$ = fromEvent(this.recognition, 'nomatch');
    const error$ = fromEvent(this.recognition, 'error');
    merge(result$, nomatch$, error$).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error),
    });
    result$.subscribe((event: SpeechRecognitionEvent) => {
      console.log(event.results[0][0].transcript);
      const scaleNames = [
        '',
        'ionisch',
        'dorisch',
        'phrysisch',
        'lydisch',
        'mixolydisch',
        'aeolisch',
        'lokrisch',
      ];
      const result = event.results[0][0].transcript;
      let url = '1';
      if (result.includes('one') || result.includes('1')) {
        url = scaleNames[1];
      }
      if (result.includes('two') || result.includes('2')) {
        url = scaleNames[2];
      }
      if (result.includes('three') || result.includes('3')) {
        url = scaleNames[3];
      }
      if (result.includes('four') || result.includes('4')) {
        url = scaleNames[4];
      }
      if (result.includes('five') || result.includes('5')) {
        url = scaleNames[5];
      }
      if (result.includes('six') || result.includes('6')) {
        url = scaleNames[6];
      }
      if (result.includes('seven') || result.includes('7')) {
        url = scaleNames[7];
      }
      console.log(url);
      this.router.navigate([url]);
    });
  }
  startRecognition() {
    this.recognition.start();
  }
}
