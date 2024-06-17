import { Routes } from '@angular/router';
import { BassComponent } from './bass.component';
import { SettingsComponent } from './setttings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ionisch',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: ':scale',
    component: BassComponent,
  },
];
