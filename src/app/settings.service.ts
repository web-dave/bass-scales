import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  sound = signal<boolean>(false);
  tones = signal<boolean>(true);
  voice = signal<SpeechSynthesisVoice | undefined>(undefined);

  eRef = effect(() => {
    console.log('sound: ', this.sound(), 'tones: ', this.tones());
  });

  audioContext = new AudioContext();
  oscList = [];
  mainGainNode: GainNode;

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

  frequencies: {
    G: number[];
    D: number[];
    A: number[];
    E: number[];
  } = {
    G: [
      207.652348789972569, 220.0, 233.081880759044958, 246.941650628062055,
      261.625565300598634,
    ],
    D: [
      155.563491861040455, 164.813778456434964, 174.614115716501942,
      184.997211355817199, 195.997717990874647,
    ],
    A: [
      116.540940379522479, 123.470825314031027, 130.812782650299317,
      138.591315488436048, 146.83238395870378,
    ],
    E: [
      87.307057858250971, 92.498605677908599, 97.998858995437323,
      103.826174394986284, 110.0,
    ],
  };
  freqFlat = [
    ...this.frequencies['E'],
    ...this.frequencies['A'],
    ...this.frequencies['D'],
    ...this.frequencies['G'],
  ];

  constructor() {
    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.connect(this.audioContext.destination);
    this.mainGainNode.gain.value = 0.4;
  }
  //   oscillators: OscillatorNode[] = this.freqFlat.map((f) => {
  //     const osc = this.audioContext.createOscillator();
  //     osc.connect(this.mainGainNode);
  //     osc.type = 'sine';
  //     osc.frequency.value = f;
  //     return osc;
  //   });
  //   oscillators: Signal<OscillatorNode[]> = computed(() => {
  //     const list: OscillatorNode[] = this.frequencies().map((f) => {
  //     });
  //     return list;
  //   });
}
