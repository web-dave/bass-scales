import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  audioInitialized = false;
  sound = signal<boolean>(true);
  tones = signal<boolean>(true);
  voice = signal<SpeechSynthesisVoice | undefined>(undefined);

  eRef = effect(() => {
    console.log('sound: ', this.sound(), 'tones: ', this.tones());
  });

  audioContext = new AudioContext();
  oscList = [];
  mainGainNode!: GainNode;

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
      587.32953583481512, 622.253967444161821, 659.255113825739859,
      698.456462866007768, 739.988845423268797,
    ],
    D: [
      440.0, 466.163761518089916, 493.883301256124111, 523.251130601197269,
      554.365261953744192,
    ],
    A: [
      329.627556912869929, 349.228231433003884, 369.994422711634398,
      391.995435981749294, 415.304697579945138,
    ],
    E: [
      246.941650628062055, 261.625565300598634, 277.182630976872096,
      293.66476791740756, 311.12698372208091,
    ],
  };

  freqFlat = [
    ...this.frequencies['E'],
    ...this.frequencies['A'],
    ...this.frequencies['D'],
    ...this.frequencies['G'],
  ];

  // audioContext!: AudioContext;
  // oscList = [];
  // mainGainNode!: GainNode;

  constructor() {}

  startAudio() {
    this.audioContext = new AudioContext();
    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.connect(this.audioContext.destination);
    this.mainGainNode.gain.value = 0.4;
    this.audioInitialized = true;
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
