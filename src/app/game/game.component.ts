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
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DragulaService } from 'ng2-dragula/components/dragula.provider';
import { window } from '@angular/platform-browser/src/facade/browser';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { Logger, GameService, ServerService, FullscreenService, StorageService } from "../shared";
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'ig-game',
  styles: [require('./game.style.scss'), require('dragula/dist/dragula.css')],
  providers: [ServerService, FullscreenService, StorageService],
  template: require('./game.template.html')
})
export class Game implements OnInit, OnDestroy {

  public plumb: any;

  public overlay: string = 'start';

  public uid: string = '';
  public player: string = '';
  public result: any = null;
  public enroll: boolean = true;

  private subscriptions: any = [];

  constructor(public game: GameService, private dragula: DragulaService,
      private storage: StorageService, private server: ServerService,
      private changeDetector: ChangeDetectorRef, private fullscreen: FullscreenService) {
  }

  start() {
    if (typeof window.orientation !== 'undefined') {
      this.fullscreen.enter();
    }
    this.game.start();
  }

  ngOnInit() {
    // Initialize game
    let settings = this.storage.getSettings() || {};
    this.player = settings.player || '';
    this.uid = settings.uid || UUID.UUID();
    this.enroll = settings.enroll !== false;

    // Initialize jsPlumb
    this.plumb = window.jsPlumb.getInstance({
      Connector: ['Straight', { gap: 0 }],
      Endpoint: ['Blank', {}],
      Anchor: ['Perimeter', { shape: 'Circle' }]
    });
    this.plumb.setContainer(window.document.querySelector('ig-game > .game-wrapper'));

    // Initialize Dragula
    this.dragula.setOptions('game-drop', {
      copy: true,
      accepts: function(el, target, source, sibling) {
        return true;
      },
      moves: function(el, handle) {
        return !!el.getAttribute('data-id');
      }
    });

    // Add window resize event listener
    this.subscriptions.push(
      fromEvent(window, 'resize').subscribe(() => this.plumb.repaintEverything())
    );

    // Subscribe for drop events
    this.subscriptions.push(
      this.dragula.drop.subscribe(data => {
        data[1].remove(); // Delete the copy
        if (data[2]) {
          this.handleDrop(data[3], data[2]);
        }
        return false;
      })
    );

    // Subscribe for drag-over events
    this.subscriptions.push(
      this.dragula.over.subscribe((data) => {
        data[2].setAttribute('dragover', '');
      })
    );
    this.subscriptions.push(
      this.dragula.out.subscribe((data) => {
        data[2].removeAttribute('dragover', '');
      })
    );

    // Subscribe for statusChanged events
    this.subscriptions.push(
      this.game.statusChanged.subscribe((status) => this.handleStatusChange(status))
    );
  }

  saveStorageSettings() {
    this.storage.saveSettings({
      uid: this.uid,
      player: this.player,
      enroll: this.enroll
    });
  }

  handleStatusChange(status: string) {
    if (status === 'playing') {
      // Save the player settings
      this.saveStorageSettings();
      this.overlay = null;
      this.result = null;
    } else if (status === 'gameover') {
      this.overlay = 'gameover';
      // Send result only when enrolled
      if (this.enroll) {
        this.server.postResult({
          uid: this.uid,
          player: this.player,
          score: this.game.score,
          time: this.game.time
        }).subscribe((result) => this.result = result);
      }
      // Workaround for https://github.com/angular/angular/issues/11712
      this.changeDetector.detectChanges();
    }
  }

  handleDrop(source, target) {
    if (target.getAttribute('data-action') === 'delete') {
      this.game.handleDelete(source.id);
    } else if (target.id.indexOf('-') > -1) {
      this.game.handleUpdate(source.id, target.id);
    } else {
      this.game.handleCreate(source.id, target.id);
    }
  }

  ngOnDestroy() {
    this.game.stop();
    this.saveStorageSettings();
    this.dragula.destroy('game-drop');
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
