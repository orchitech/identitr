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
import * as _ from 'lodash';

import { User } from './user.model';
import { Sequence } from './sequence.model';

/**
 * Object container.
 */
export class System {

  public data: User[];
  public type: string; // Filled by SystemComponent

  private idseq: Sequence = new Sequence();

  constructor(
    public id: string, public name: string, public size: number,
    public description?: string, public validate?: any
  ) {
    this.data = new Array(size).fill(null);
    if (!this.validate) {
      this.validate = () => true;
    }
  }

  /**
   * Register created object in the system.
   */
  createObject(object: User) {
    object.id = this.id + '-' + this.idseq.next();
    this.data[this.data.indexOf(null)] = object;
    return object.id;
  }

  /**
   * Delete previously registered object from the system.
   */
  deleteObject(id) {
    let index = _.findIndex(this.data, { id: id });
    if (index >= 0) {
      this.data[index] = null;
    }
  }

  /**
   * Update registered object in the system.
   */
  updateObject() {
    // no-op
  }

  /**
   * Find object by the given template.
   */
  findObject(template) {
    return _.find(this.data, template);
  }

  /**
   * Determine whether the system is at it's capacity.
   */
  isFull() {
    return this.data.indexOf(null) < 0;
  }

  /**
   * Remove all registered objects.
   */
  clear() {
    this.data.fill(null);
  }

  /**
   * Get all registered objects.
   */
  getObjects() {
    return this.data.filter(object => !!object);
  }

}
