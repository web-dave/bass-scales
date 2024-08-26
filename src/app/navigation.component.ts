import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsService } from './settings.service';

@Component({
  selector: 'bass-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: ` <ul>
    @for (scale of scaleNames; track $index) {
      <li>
        <a routerLinkActive="active" [routerLink]="scale">{{ scale }}</a>
      </li>
    }
    <li>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="40px"
        viewBox="0 -960 960 960"
        width="40px"
        fill="#e8eaed"
        (click)="sendEvent('speak')"
      >
        <path
          d="M726.67-446.67v-66.66H880v66.66H726.67ZM776-160l-123.33-92 40-53.33 123.33 92L776-160Zm-81.33-495.33-40-53.34L776-800l40 53.33-121.33 91.34ZM206.67-200v-160h-60q-27.5 0-47.09-19.58Q80-399.17 80-426.67v-106.66q0-27.5 19.58-47.09Q119.17-600 146.67-600H320l200-120v480L320-360h-46.67v160h-66.66Zm246.66-158v-244L338-533.33H146.67v106.66H338L453.33-358ZM560-346v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346ZM300-480Z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="40px"
        viewBox="0 -960 960 960"
        width="40px"
        fill="#e8eaed"
        (click)="sendEvent('play')"
      >
        <path
          d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="40px"
        viewBox="0 -960 960 960"
        width="40px"
        fill="#e8eaed"
        (click)="sendEvent('stop')"
      >
        <path
          d="M326.67-326.67h306.66v-306.66H326.67v306.66ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Zm.15-66.67q139 0 236-97.33t97-236.33q0-139-96.87-236-96.88-97-236.46-97-138.67 0-236 96.87-97.33 96.88-97.33 236.46 0 138.67 97.33 236 97.33 97.33 236.33 97.33ZM480-480Z"
        />
      </svg>
    </li>
  </ul>`,
  styles: `
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #333;
      li {
        float: left;
      }
      a {
        display: block;
        color: white;
        text-align: center;
        padding: 6px 16px;
        text-decoration: none;
        font-size: 14px;
        &:hover:not(.active) {
          background-color: #111;
        }
        &.active {
          background-color: hotpink;
        }
      }
    }
  `,
})
export class NavigationComponent {
  service = inject(SettingsService);
  scaleNames = [
    'ionisch',
    'dorisch',
    'phrygisch',
    'lydisch',
    'mixolydisch',
    'aeolisch',
    'lokrisch',
  ];

  sendEvent(e: 'speak' | 'play' | 'stop') {
    this.service.controls.set(e);
  }
}
