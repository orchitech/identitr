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
import { Subject } from 'rxjs/Subject';

/**
 * User data model.
 */
export class User {

  public id: string;
  public name: string;
  /**
   * Allowed states:
   * - normal
   * - deleted (temporary state)
   * - created (temporary state)
   * - invalid (temporary state)
   * - illegal (temporary state)
   */
  public status: string;
  /**
   * Timer countdown (0-100).
   */
  public timer: number = -1;
  /**
   * Timeout observable.
   */
  public timeout: Subject<User> = new Subject<User>();
  /**
   * Timer interval.
   */
  private interval: any = null;


  constructor(name: string, status: string = 'created') {
    this.name = name;
    this.status = status;
  }

  public startTimer(reset = false) {
    if (this.interval !== null && !reset) {
      return false;
    }
    this.timer = 100.0;
    if (!this.interval) {
      this.interval = setInterval(() => this.countdown(0.5), 25);
    }
    return true;
  }

  public clearTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.timer = -1;
  }

  private countdown(delta) {
    this.timer -= delta;
    if (this.timer < 0) {
      this.clearTimer();
      this.timeout.next(this);
    }
  }

}
