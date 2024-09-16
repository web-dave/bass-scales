import { Injectable, effect, signal } from '@angular/core';
import { fingers, IInstrument } from './fingers';
import { getFrequencies, IString } from './allnotes';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  audioInitialized = false;
  sound = signal<boolean>(true);
  tones = signal<boolean>(true);
  voice = signal<SpeechSynthesisVoice | undefined>(undefined);
  instrument = signal<IInstrument>('bass');

  controls = signal<'speak' | 'play' | 'stop'>('stop');

  eRef = effect(() => {
    console.log('sound: ', this.sound(), 'tones: ', this.tones());
  });

  audioContext!: AudioContext;
  oscList = [];
  mainGainNode!: GainNode;
  mainGainNodeS = signal<GainNode | null>(null);

  scales: { [key: string]: number[][] } = {
    ionian: [
      [1, 2, 4],
      [1, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
    ],
    dorian: [
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 3],
    ],
    phrygian: [
      [0, 2, 4],
      [0, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
    ],
    lydian: [
      [1, 3, 4],
      [1, 2, 4],
      [1, 2, 4],
      [0, 2, 4],
    ],
    mixolydian: [
      [1, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 4],
    ],
    aeolian: [
      [0, 2, 4],
      [0, 2, 4],
      [0, 2, 3],
      [0, 2, 3],
    ],
    locrian: [
      [1, 3, 4],
      [1, 3, 4],
      [1, 2, 4],
      [1, 2, 4],
    ],
  };

  frequencies: {
    e: number[];
    H: number[];
    G: number[];
    D: number[];
    A: number[];
    E: number[];
  } = {
    e: [],
    H: [],
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

  stringsMap: { [key: string]: IString[] } = {
    bass: ['G', 'D', 'A', 'E'],
    guitar: ['e', 'H', 'G', 'D', 'A', 'E'],
  };

  strings = this.stringsMap['bass'];

  // freqFlat = [
  //   ...this.frequencies['E'],
  //   ...this.frequencies['A'],
  //   ...this.frequencies['D'],
  //   ...this.frequencies['G'],
  // ];

  startAudio(instrument: IInstrument) {
    this.init(instrument);
    this.audioContext = new AudioContext();
    this.mainGainNode = this.audioContext.createGain();
    this.mainGainNode.connect(this.audioContext.destination);
    this.mainGainNode.gain.value = 0.4;
    this.audioInitialized = true;
    this.mainGainNodeS.set(this.mainGainNode);
  }
  init(instrument: IInstrument) {
    this.instrument.set(instrument);
    this.scales = fingers[instrument];
    this.strings = this.stringsMap[instrument];
    this.frequencies = getFrequencies(this.strings);
  }
}
