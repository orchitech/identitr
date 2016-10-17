/*
 * Copyright 2016 Orchitech Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, Input, OnDestroy } from '@angular/core';

import { Logger } from './logger.service';
import { User } from './user.model';
import { GameService } from './game.service';

@Component({
  selector: 'ig-user',
  styles: [require('./user.style.scss'), require('dragula/dist/dragula.css')],
  template: `
    <div class="user" [attr.data-id]="user.id" *ngIf="user" [attr.data-status]="user.status">
      <div class="icon">
        <svg [attr.fill]="user.failed ? '#FF0000' : '#000000'" height="50" viewBox="0 0 26 26" width="50" xmlns="http://www.w3.org/2000/svg">
          <g [ngSwitch]="user.status">
            <g *ngSwitchCase="'normal'" transform="translate(1, 1)">
              <path class="highlight" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </g>
            <g *ngSwitchCase="'created'" transform="translate(1, 1)">
              <path class="highlight" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </g>
            <g *ngSwitchCase="'deleted'" transform="translate(1, 1)">
              <path class="highlight" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </g>
            <g *ngSwitchCase="'illegal'" transform="translate(1, 1)">
              <path class="highlight" d="M12,14c-2.67,0-8,1.34-8,4v2h16v-2C20,15.34,14.67,14,12,14z" />
              <path class="highlight" d="M8.194,7.396c-0.07,0.3-0.11,0.62-0.11,0.94c0,0.26,0.02,0.52,0.07,0.76c1.19-1.24,2.11-2.13,3.44-2.89
                C10.234,6.256,8.984,6.887,8.194,7.396z" />
              <path class="highlight" d="M12.174,12.426c2.26,0,4.09-1.84,4.09-4.09c0-0.42-0.06-0.83-0.18-1.21c-0.47-0.21-1.13-0.47-1.93-0.65h-0.011
                c-0.189-0.05-0.37-0.09-0.58-0.12h-0.01l-1.56,0.77c0.03,0.17,0.05,0.4,0.03,0.65c-0.01,0.49-0.14,1.05-0.59,1.35
                c-0.31,0.21-0.72,0.31-1.2,0.31c-0.38,0-0.69-0.06-0.78-0.08l-0.11-0.04c-0.09,0.09-0.19,0.18-0.28,0.28l-0.01,0.01l-0.53,0.56
                C9.184,11.506,10.574,12.426,12.174,12.426z" />
              <path class="highlight" d="M8.934,5.856c0.82-0.37,1.8-0.66,2.84-0.66c0.59,0,1.14,0.05,1.65,0.13h0.01c0.34,0.04,0.65,0.11,0.96,0.18h0.011
                c0.3,0.07,0.579,0.15,0.84,0.23h0.01c0.02,0,0.04,0.01,0.06,0.02c0.011,0,0.021,0,0.03,0.01c0.8,0.26,1.4,0.56,1.75,0.75
                c0.51-0.55,1.26-1.57,1-2.38c-0.07-0.08-0.4-0.1-0.59-0.11c-0.45-0.02-0.99-0.05-1.521-0.33c-0.52-0.29-0.71-0.82-0.88-1.29
                c-0.3-0.83-0.58-1.61-2.66-1.61c-2.4,0-2.93,1-3.6,2.26l-0.17,0.33c-0.4,0.74-1.11,0.84-1.63,0.91c-0.54,0.08-0.73,0.13-0.84,0.43
                c-0.1,0.26,0.31,1.24,0.9,2.21C7.504,6.637,8.144,6.207,8.934,5.856z" />
            </g>
            <g *ngSwitchCase="'invalid'" transform="translate(13 13) scale(0.8) translate(-12 -12)">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path class="highlight" d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49
                0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0
                .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6
                8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
            </g>
          </g>
          <g *ngIf="user.timer > -1" transform="translate(13 13) rotate(90) translate(-13 -13)">
            <path d="M2,13a11,11 0 1,0 22,0a11,11 0 1,0 -22,0" class="timer" [style.strokeDashoffset]="70 - 70.0 * user.timer / 100"></path>
          </g>
        </svg>
      </div>
      <div class="name" [attr.data-state]="user.state" (click)="user.startTimer(true)">
        <span>{{user.name}}</span>
      </div>
    </div>
  `
})
export class UserComponent implements OnDestroy {

  @Input() user: User;

  constructor() { }

  ngOnDestroy() {
    // Better safe than sorry
    this.user.clearTimer();
  }

}
