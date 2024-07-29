import { Routes } from '@angular/router';
import { BassComponent } from './bass.component';
import { SettingsComponent } from './setttings.component';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SettingsService } from './settings.service';
import { filter } from 'rxjs';

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
    canActivate: [
      () => {
        return toObservable(inject(SettingsService).mainGainNodeS).pipe(
          filter((node) => !!node),
        );
      },
    ],
  },
];
