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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

import { Logger } from '../shared/logger.service';
import { User } from '../shared/user.model';
import { System } from '../shared/system.model';
import { Link } from '../shared/link.model';

@Injectable()
export class GameService {

  // Available user names
  private users: any = {
    'Sandra': '#ccaa88',
    'Daniel': '#cc88aa',
    'Karel': '#88dd88',
    'Robert': '#8888cc',
    'Pavel': '#cccc88',
    'Bára': '#cc88cc',
    'Martin': '#cc8888',
    'Lukáš': '#88cccc',
    'Eliška': '#aaccaa',
    'Ondra': '#88ccaa',
    'David': '#ccaaaa'
  };

  // All registered systems
  private systems: System[] = [
    new System('egje', 'EGJE', 4, 'zaměstnanci'),
    new System('kos', 'KOS', 6, 'studenti'),
    new System('idm', 'IdM', 10),
    new System('mis', 'MIS', 5, 'zaměstnanci', source => source.egje),
    new System('ldap', 'AD', 10, 'všichni')
  ];

  // Source system IDs
  public sources: string[] = ['egje', 'kos'];
  // Target system IDs
  public targets: string[] = ['mis', 'ldap'];
  // System user links
  public links: Link[] = [];

  // Game status (stopped, playing, gameover)
  public status = 'stopped';
  // Game score
  public score: number = 0;
  // Game time
  public time: number = 0;
  // Event spawn time
  private spawn: number;

  // Game ticker
  private ticker: any;

  // Sources
  public statusChanged = new Subject<string>();

  constructor(private logger: Logger) {
    // this.getSystem('idm').createObject(this.createUser('Pavel', 'created'));
    // this.getSystem('idm').createObject(this.createUser('Pavel', 'invalid'));
    // this.getSystem('idm').createObject(this.createUser('Pavel', 'normal'));
    // this.getSystem('idm').createObject(this.createUser('Pavel', 'illegal'));
    // this.getSystem('idm').createObject(this.createUser('Pavel', 'invalid'));
  }

  private createUser(name: string, state?: string): User {
    let user = new User(name, state);
    user.timeout.subscribe((user) => this.onTimeout(user));
    return user;
  }

  start(reset: boolean = true) {
    this.logger.debug('[GAME] START');
    if (this.status === 'playing') {
      this.stop(); // Stop the game first
    }
    if (reset) {
      this.reset(); // Do game RESET
    }
    this.ticker = setInterval(() => {
      if (this.spawn <= ++this.time && this.status === 'playing') {
        this.generateEvent();
        this.scheduleSpawn();
      }
    }, 1000);
    this.status = 'playing';
    this.statusChanged.next(this.status);
  }

  stop() {
    this.logger.debug('[GAME] STOP');
    if (this.status !== 'playing') {
      return; // Invalid STOP call
    }
    if (this.ticker) {
      clearInterval(this.ticker);
    }
    this.status = 'stopped';
  }

  reset() {
    this.logger.debug('[GAME] RESET');
    // Empty systems
    this.systems.forEach(system => system.clear());
    // Empty links
    this.links.splice(0, this.links.length);
    // Reset score and time
    this.score = 0;
    this.time = 0;
    this.spawn = 3;
    // Reset game status
    if (this.status === 'gameover') {
      this.status = 'stopped';
    }
  }

  /**
   * Get system by its identifier.
   */
  getSystem(id): System {
    return _.find(this.systems, { id: id });
  }

  /**
   * Get system for a user with the given identifier.
   */
  getSystemForUser(id): System {
    let [systemId, userId] = id.split('-');
    return this.getSystem(systemId);
  }

  /**
   * Handle user CREATE action.
   */
  handleCreate(sourceId: string, systemId: string) {
    if (this.status !== 'playing') {
      return; // Do not accept any interaction when not playing
    }
    this.logger.debug('[ACTION] CREATE', systemId, sourceId);
    let source = this.getSystemForUser(sourceId);
    let sourceObject = source.findObject({ id: sourceId });
    let target = this.getSystem(systemId);
    // Check disallowed combinations
    if (!this.isMappingValid(source.id, systemId)) {
      return; // Invalid mapping.
    } else if (target.findObject({ name: sourceObject.name })) {
      return; // System already contains the object.
    } else if (!target.validate(sourceObject)) {
      return; // Not a valid source for the target.
    }
    let targetObject = this.createUser(sourceObject.name);
    target.createObject(targetObject);
    this.score++;
    this.links.push(new Link(sourceId, targetObject.id, this.users[sourceObject.name]));
    // Post-process created link
    this.onLink(source, sourceObject, target, targetObject);
  }

  /**
   * Handle user UPDATE action.
   */
  handleUpdate(sourceId: string, targetId: string) {
    if (this.status !== 'playing') {
      return; // Do not accept any interaction when not playing
    }
    this.logger.debug('[ACTION] UPDATE', sourceId, targetId);
    let source = this.getSystemForUser(sourceId);
    let target = this.getSystemForUser(targetId);
    // Check disallowed combinations
    if (!this.isMappingValid(source.id, target.id)) {
      return; // Invalid mapping.
    }
    // Validate name match
    let sourceObject = source.findObject({ id: sourceId });
    let targetObject = target.findObject({ id: targetId });
    if (sourceObject.name !== targetObject.name) {
      return; // Names don't match.
    } else if (!target.validate(sourceObject)) {
      return; // Source is not eligible
    }
    // Check if there is already a link
    if (!_.some(this.links, { sourceId: sourceId, targetId: targetId })) {
      this.links.push(new Link(sourceId, targetId, this.users[sourceObject.name]));
    }
    // Post-process created link
    this.onLink(source, sourceObject, target, targetObject);
    this.score++;
  }

  /**
   * Handle user DELETE action.
   */
  handleDelete(objectId: string) {
    if (this.status !== 'playing') {
      return; // Do not accept any interaction when not playing
    }
    this.logger.debug('[ACTION] DELETE', objectId);
    let system = this.getSystemForUser(objectId);
    let object = system.findObject({ id: objectId });
    // Check object status
    if (this.sources.indexOf(system.id) >= 0 && object.status !== 'deleted') {
      return; // Can not delete non-deleted source objects
    }
    // Check source links
    let valid = _.filter(this.links, { targetId: objectId }).some(link => {
      let source = this.getSystemForUser(link.sourceId);
      let sourceObject = source.findObject({ id: link.sourceId });
      return system.validate(sourceObject);
    });
    if (valid) {
      return; // Can not delete valid linked object
    }
    object.clearTimer();
    system.deleteObject(objectId);
    this.score++;
    // Propagate deletion
    _.filter(this.links, { sourceId: objectId }).forEach(link => {
      this.links.splice(this.links.indexOf(link), 1);
      let target = this.getSystemForUser(link.targetId);
      let targetObject = target.findObject({ id: link.targetId });
      this.onUnlink(system, target, targetObject);
    });
    _.filter(this.links, { targetId: objectId }).forEach(link => {
      this.links.splice(this.links.indexOf(link), 1);
    });
  }

  /**
   * Check whether the source system can be linked to the target system.
   */
  isMappingValid(sourceId, targetId): boolean {
    if (this.sources.indexOf(targetId) > -1) {
      return false; // Can not link to source systems.
    } else if (this.targets.indexOf(sourceId) > -1) {
      return false; // Can not link from target systems.
    } else if (sourceId === targetId) {
      return false; // Can not link the same system.
    } else if (sourceId !== 'idm' && targetId !== 'idm') {
      return false; // IdM system must be either a source or target.
    }
    return true;
  }

  /**
   * Post-process LINK action.
   */
  onLink(source, sourceObject, target, targetObject) {
    this.logger.debug('[ACTION] LINK', sourceObject.id, targetObject.id);
    // Update target object properties
    targetObject[source.id] = true;
    // Reset temporary status of the target object
    if (targetObject.status !== 'normal') {
      targetObject.status = 'normal';
      targetObject.clearTimer();
    }
    // Reset created status of the source object
    if (sourceObject.status === 'created' && source.id !== 'idm') {
      sourceObject.status = 'normal';
      sourceObject.clearTimer();
    }
    // Perform SYNC check on the IdM object
    this.checkSync(target.id === 'idm' ? targetObject : sourceObject);
  }

  /**
   * Post-process UNLINK action.
   */
  onUnlink(source, target, targetObject) {
    this.logger.debug('[ACTION] UNLINK', source.id, targetObject.id);
    // Update target object properties
    targetObject[source.id] = false;
    // Require DELETE if no longer linked
    if (!_.some(this.links, { targetId: targetObject.id })) {
      targetObject.status = 'deleted';
      this.logger.debug('[TIMER] DELETED', targetObject.id);
      targetObject.startTimer(true);
    }
    // Perform SYNC check on the IdM object
    if (target.id === 'idm' && targetObject.status !== 'deleted') {
      this.checkSync(targetObject);
    }
  }

  /**
   * Check IdM object synchronization status.
   */
  checkSync(object) {
    this.logger.debug('[EVENT] SYNC', object.id);
    let links = _.filter(this.links, { sourceId: object.id });
    let linkedSystems = {};
    // Go through linked systems
    links.forEach(link => {
      let system = this.getSystemForUser(link.targetId);
      let target = system.findObject({ id: link.targetId });
      let valid = system.validate(object);
      if (!valid && target.startTimer()) {
        this.logger.debug('[TIMER] INVALID', target.id);
        target.status = 'deleted';
      } else if (valid && target.status === 'deleted') {
        target.status = 'normal';
        target.clearTimer();
      }
      linkedSystems[system.id] = true;
    });
    // Check for missing links
    let linksMissing = this.targets.some(id => {
      let system = this.getSystem(id);
      return system.validate(object) && !linkedSystems[id];
    });
    if (linksMissing && object.startTimer()) {
      this.logger.debug('[TIMER] MISSING', object.id);
    } else if (!linksMissing) {
      object.clearTimer(true);
    }
  }

  /**
   * Schedule next event spawn.
   */
  scheduleSpawn() {
    let delay = 5;
    if (this.score > 40 && Math.random() < 0.2) {
      delay--;
    }
    if (this.score > 80 && Math.random() < 0.3) {
      delay--;
    }
    if (this.score > 120 && Math.random() < 0.2) {
      delay--;
    }
    this.spawn = this.time + delay;
    this.logger.debug('[SCHEDULE]', delay);
  }

  /**
   * Generate random event.
   */
  generateEvent() {
    this.logger.debug('[EVENT] GENERATE');
    // When to start generate target events
    let targetFromScore = 20;
    // Target to source system event rate
    let targetEventRate = 0.3;
    // Pick system layer for the random event
    let systemLayer = 'sources';
    if (targetFromScore <= this.score && Math.random() < targetEventRate) {
      systemLayer = 'targets';
    }
    let system = this[systemLayer][(Math.random() * 2)|0];
    this.generateSystemEvent(system, systemLayer === 'targets');
  }

  /**
   * Generate event for the given system.
   */
  generateSystemEvent(id, target) {
    let system = this.getSystem(id);
    // Creation to deletion event preference
    let createEventRate = this.sources.indexOf(id) >= 0 ? 0.6 : 0.4;
    // Pick event type
    let createEvent = Math.random() < createEventRate;
    let fullSystem = system.isFull();
    if (createEvent && !fullSystem) {
      this.generateCreateEvent(system, target);
    } else if (system.findObject({ status: 'normal' })) {
      this.generateDeleteEvent(system, target);
    } else if (!fullSystem) {
      this.generateCreateEvent(system, target);
    }
  }

  /**
   * Generate CREATE event in the given system.
   */
  generateCreateEvent(system, target) {
    let availableNames = Object.keys(this.users);
    let nameIndex = (Math.random() * availableNames.length)|0;
    while (system.findObject({ name: availableNames[nameIndex] })) {
      nameIndex = (nameIndex + 1) % availableNames.length;
    }
    let user = this.createUser(availableNames[nameIndex], target ? 'illegal' : 'created');
    user.startTimer(true);
    system.createObject(user);
    this.logger.debug('[EVENT] CREATE', user.id);
  }

  /**
   * Generate DELETE event in the given system.
   */
  generateDeleteEvent(system, target) {
    let objects = system.getObjects();
    let objectIndex = (Math.random() * objects.length)|0;
    while (objects[objectIndex].status !== 'normal') {
      objectIndex = (objectIndex + 1) % objects.length;
    }
    let user = objects[objectIndex];
    user.status = target ? 'invalid' : 'deleted';
    user.startTimer(true);
    this.logger.debug('[EVENT] DELETE', user.id);
  }

  /**
   * Handle game event timeout.
   */
  onTimeout(user) {
    // Stop the game
    this.stop();
    // Stop active timers
    this.systems.forEach(system => system.getObjects().forEach(user => user.clearTimer()));
    // Mark user as failed
    user.failed = true;
    // Set GAME OVER status
    this.logger.debug('[GAME]', 'GAME OVER', user.id, user.name);
    this.status = 'gameover';
    this.statusChanged.next(this.status);
  }

}
