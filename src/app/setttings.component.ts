import { Component, inject } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'bass-settings',
  standalone: true,
  imports: [],
  template: `
    <form action="">
      <label class="form-control">
        <input
          type="checkbox"
          name="sound"
          id="sound"
          #soundInput
          (change)="sound.set(soundInput.checked)"
          [checked]="sound()"
        />
        Sound
      </label>
      <label class="form-control">
        <input
          type="checkbox"
          name="tones"
          id="tones"
          #toneInput
          (change)="tones.set(toneInput.checked)"
          [checked]="tones()"
        />
        tones
      </label>
    </form>
  `,
})
export class SettingsComponent {
  sound = inject(SettingsService).sound;
  tones = inject(SettingsService).tones;
}
