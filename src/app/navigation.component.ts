import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
        padding: 14px 16px;
        text-decoration: none;
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
  scaleNames = [
    'ionisch',
    'dorisch',
    'phrysisch',
    'lydisch',
    'mixolydisch',
    'aeolisch',
    'lokrisch',
  ];
}
