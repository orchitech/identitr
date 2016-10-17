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
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';

import { Link } from './link.model';

@Component({
  selector: 'ig-link',
  styles: [require('./link.style.scss')],
  template: `
    {{link.sourceId}}:{{link.targetId}}
  `,
})
export class LinkComponent implements AfterViewInit, OnDestroy {

  @Input() link: Link;
  @Input() plumb: any;

  private connection: any = null;

  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.connection = this.plumb.connect({
        source: this.link.sourceId,
        target: this.link.targetId,
        paintStyle: {
          lineWidth: 3,
          strokeStyle: this.link.color || '#888888'
        }
      });
    }, 200);
  }

  ngOnDestroy() {
    if (this.connection) {
      this.plumb.detach(this.connection);
    }
  }

}
