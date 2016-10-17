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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ServerService } from '../shared/server.service';
import { Logger } from '../shared/logger.service';

@Component({
  selector: 'ig-score',
  styles: [require('./score.style.scss')],
  providers: [ServerService],
  template: require('./score.template.html')
})
export class Score implements OnInit, OnDestroy {

  params: Params = null;
  result: any = {};
  interval: number = null;

  constructor(private server: ServerService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.params = params;
      this.getResults(this.params);
    });
  }

  ngOnInit() {
    this.interval = window.setInterval(() => {
      if (this.params) {
        this.getResults(this.params);
      }
    }, 30 * 1000);
  }

  getResults(params: any) {
    this.server.getResults(params).subscribe((result) => {
      this.result = result;
    });
  }

  ngOnDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

}
