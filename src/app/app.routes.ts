import { Routes } from '@angular/router';
import { Game } from './game';
import { Help } from './help/help.component';
import { Score } from './score/score.component';

export const ROUTES: Routes = [
  {path: '', component: Game},
  {path: 'help', component: Help},
  {path: 'score', component: Score},
  {path: 'game', redirectTo: '', pathMatch: 'full'},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
