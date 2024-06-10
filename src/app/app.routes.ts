import { Routes } from '@angular/router';
import { BassComponent } from './bass.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ionisch',
    pathMatch: 'full',
  },
  {
    path: ':scale',
    component: BassComponent,
  },
];
