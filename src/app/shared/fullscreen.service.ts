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
import { Injectable } from '@angular/core';
import { document, window } from '@angular/platform-browser/src/facade/browser';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class FullscreenService {

  public active: Subject<boolean> = new Subject<boolean>();

  private content: any = document.documentElement;

  constructor() {
    let event = 'fullscreenchange';
    if (document.mozCancelFullScreen) {
      event = 'mozfullscreenchange';
    } else if (document.webkitExitFullscreen) {
      event = 'webkitfullscreenchange';
    }
    document.addEventListener(event, () => {
      this.active.next(this.isActive());
    });
  }

  isActive(): boolean {
    return !!(document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement);
  }

  toggle() {
    if (this.isActive()) {
      this.exit();
    } else {
      this.enter();
    }
  }

  enter() {
    if (this.content.requestFullscreen) {
      this.content.requestFullscreen();
    } else if (this.content.msRequestFullscreen) {
      this.content.msRequestFullscreen();
    } else if (this.content.mozRequestFullScreen) {
      this.content.mozRequestFullScreen();
    } else if (this.content.webkitRequestFullscreen) {
      this.content.webkitRequestFullscreen(window.Element['ALLOW_KEYBOARD_INPUT']);
    }
  }

  exit() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

}
