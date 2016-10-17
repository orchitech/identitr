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
import { Component, OnInit, Input } from '@angular/core';

import { System } from './system.model';
import { GameService } from './game.service';

@Component({
  selector: 'ig-system',
  styles: [require('./system.style.scss')],
  template: `
    <div class="text">
      <div class="name" [class.idm]="system.type == 'idm'">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24">
          <g *ngIf="system.type == 'target'">
            <circle fill="#cccccc" cx="12.095" cy="5.721" r="2.797" />
            <circle fill="#cccccc" cx="12.095" cy="14.378" r="2.797" />
            <circle fill="#cccccc" cx="4.796" cy="18.942" r="2.796" />
            <circle fill="#cccccc" cx="19.394" cy="18.942" r="2.796" />
            <line fill="none" stroke="#cccccc" stroke-width="1.8" stroke-miterlimit="10" x1="12.095" y1="5.721" x2="12.095" y2="14.378" />
            <line fill="none" stroke="#cccccc" stroke-width="1.8" stroke-miterlimit="10" x1="12.095" y1="14.378" x2="19.395" y2="18.942" />
            <line fill="none" stroke="#cccccc" stroke-width="1.8" stroke-miterlimit="10" x1="12.095" y1="14.378" x2="4.795" y2="18.942" />
          </g>
          <g *ngIf="system.type == 'source'" fill="#cccccc">
            <rect x="8.058" y="2.945" width="2.67" height="17.672" />
            <rect x="2.553" y="12.91" width="2.67" height="7.707" />
            <rect x="13.563" y="2.945" width="2.671" height="17.672" />
            <rect x="19.067" y="6.827" width="2.671" height="13.791" />
          </g>
          <g *ngIf="system.type == 'idm'" fill="#cccccc">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.987,8.905c0.057,0.28,0.094,0.566,0.109,0.859
              c-0.278,0.115-0.639,0.24-1.077,0.376c0,0.014,0.002,0.027,0.002,0.041c0,0.118-0.006,0.235-0.012,0.352
              c0.431,0.16,0.782,0.305,1.057,0.438c-0.035,0.289-0.089,0.572-0.157,0.848c-0.304,0.024-0.684,0.033-1.146,0.027
              c-0.039,0.125-0.083,0.249-0.13,0.37c0.359,0.286,0.648,0.534,0.869,0.743c-0.122,0.262-0.262,0.516-0.415,0.758
              c-0.294-0.07-0.659-0.181-1.095-0.328c-0.076,0.106-0.156,0.212-0.239,0.312c0.254,0.382,0.452,0.705,0.596,0.973
              c-0.195,0.212-0.406,0.411-0.627,0.594c-0.259-0.158-0.572-0.373-0.939-0.649c-0.106,0.077-0.214,0.15-0.324,0.221
              c0.123,0.445,0.211,0.814,0.266,1.112c-0.25,0.139-0.511,0.263-0.78,0.371c-0.197-0.232-0.427-0.535-0.693-0.907
              c-0.124,0.039-0.25,0.076-0.377,0.108c-0.02,0.458-0.051,0.839-0.09,1.139c-0.279,0.055-0.566,0.093-0.856,0.108
              c-0.116-0.279-0.242-0.638-0.378-1.076c-0.014,0-0.027,0-0.042,0c-0.118,0-0.234-0.003-0.352-0.011
              c-0.159,0.431-0.306,0.781-0.437,1.055c-0.289-0.033-0.572-0.086-0.849-0.155c-0.023-0.305-0.032-0.685-0.025-1.144
              c-0.126-0.04-0.25-0.083-0.371-0.133c-0.286,0.36-0.534,0.65-0.742,0.868c-0.263-0.123-0.517-0.26-0.759-0.413
              c0.072-0.294,0.181-0.659,0.328-1.095c-0.105-0.077-0.21-0.157-0.31-0.24c-0.383,0.254-0.708,0.451-0.975,0.596
              c-0.211-0.195-0.409-0.404-0.593-0.627c0.158-0.259,0.375-0.57,0.65-0.938c-0.078-0.105-0.152-0.214-0.223-0.323
              c-0.442,0.122-0.812,0.211-1.111,0.266c-0.139-0.25-0.264-0.512-0.371-0.78c0.231-0.197,0.533-0.428,0.909-0.692
              c-0.041-0.124-0.079-0.25-0.11-0.378c-0.459-0.019-0.839-0.05-1.14-0.09c-0.054-0.28-0.091-0.566-0.109-0.856
              c0.281-0.117,0.64-0.242,1.079-0.379c-0.001-0.013-0.001-0.027-0.001-0.042c0-0.118,0.004-0.234,0.012-0.351
              C1.579,9.671,1.228,9.524,0.955,9.394C0.989,9.103,1.042,8.82,1.111,8.545c0.303-0.024,0.684-0.033,1.143-0.026
              c0.04-0.126,0.084-0.25,0.133-0.371c-0.36-0.287-0.649-0.534-0.869-0.743C1.64,7.143,1.778,6.89,1.932,6.647
              c0.295,0.072,0.659,0.181,1.095,0.329c0.076-0.106,0.156-0.21,0.239-0.312C3.012,6.282,2.814,5.958,2.67,5.691
              C2.866,5.48,3.076,5.282,3.297,5.098c0.26,0.159,0.571,0.375,0.939,0.65C4.342,5.669,4.45,5.596,4.561,5.525
              C4.438,5.082,4.35,4.712,4.294,4.415c0.25-0.14,0.511-0.264,0.78-0.371c0.197,0.231,0.427,0.533,0.693,0.909
              c0.125-0.041,0.25-0.079,0.376-0.11c0.021-0.46,0.051-0.839,0.09-1.14C6.513,3.649,6.8,3.611,7.091,3.593
              c0.116,0.28,0.241,0.64,0.377,1.078c0.014,0,0.027-0.002,0.041-0.002c0.118,0,0.235,0.006,0.351,0.013
              C8.021,4.252,8.166,3.9,8.298,3.627c0.29,0.034,0.572,0.087,0.849,0.157C9.171,4.087,9.18,4.467,9.173,4.927
              c0.125,0.039,0.25,0.083,0.371,0.132c0.286-0.36,0.532-0.649,0.742-0.869c0.263,0.123,0.516,0.26,0.759,0.415
              c-0.071,0.295-0.182,0.659-0.329,1.095c0.105,0.076,0.211,0.155,0.311,0.239C11.409,5.684,11.733,5.486,12,5.342
              c0.211,0.196,0.41,0.406,0.594,0.627c-0.159,0.259-0.375,0.57-0.651,0.939c0.078,0.105,0.152,0.212,0.222,0.324
              c0.443-0.125,0.813-0.213,1.112-0.268c0.14,0.25,0.264,0.511,0.371,0.781c-0.231,0.196-0.534,0.427-0.91,0.692
              c0.041,0.125,0.08,0.25,0.112,0.378C13.309,8.836,13.688,8.865,13.987,8.905z M7.234,10.876c0.37,0.122,0.768-0.079,0.891-0.449
              c0.121-0.371-0.08-0.77-0.451-0.892c-0.369-0.122-0.768,0.08-0.89,0.45S6.864,10.755,7.234,10.876z M5.704,10.525
              C5.433,9.229,4.688,8.287,4.04,8.423c-0.648,0.135-0.955,1.296-0.684,2.593c0.271,1.296,1.016,2.238,1.664,2.103
              C5.669,12.982,5.975,11.822,5.704,10.525z M8.744,6.275C7.487,5.861,6.298,6.036,6.092,6.664C5.885,7.293,6.737,8.14,7.995,8.553
              c1.259,0.414,2.447,0.239,2.655-0.39C10.855,7.533,10.003,6.688,8.744,6.275z M11.274,10.894c-0.441-0.493-1.599-0.178-2.587,0.705
              C7.7,12.482,7.258,13.598,7.7,14.093c0.441,0.493,1.599,0.178,2.586-0.705C11.273,12.504,11.717,11.388,11.274,10.894z" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.989,12.773c0.066,0.208,0.119,0.423,0.159,0.645
              c-0.205,0.111-0.466,0.238-0.788,0.384c0.002,0.01,0.003,0.02,0.003,0.029c0.011,0.092,0.019,0.181,0.021,0.27
              c0.345,0.084,0.624,0.164,0.844,0.242c0,0.224-0.014,0.443-0.044,0.66c-0.229,0.046-0.518,0.085-0.872,0.12
              c-0.018,0.1-0.039,0.199-0.067,0.294c0.302,0.189,0.544,0.353,0.729,0.493c-0.071,0.21-0.152,0.416-0.25,0.614
              c-0.23-0.029-0.52-0.081-0.863-0.156c-0.048,0.09-0.103,0.176-0.157,0.259c0.229,0.27,0.407,0.501,0.542,0.692
              c-0.131,0.179-0.273,0.348-0.426,0.508c-0.213-0.102-0.47-0.235-0.774-0.413c-0.073,0.067-0.15,0.134-0.227,0.196
              c0.132,0.328,0.229,0.602,0.299,0.826c-0.179,0.127-0.365,0.244-0.563,0.351c-0.169-0.158-0.372-0.371-0.607-0.633
              c-0.091,0.043-0.185,0.082-0.279,0.118c0.025,0.353,0.035,0.644,0.031,0.877c-0.206,0.066-0.424,0.12-0.644,0.158
              c-0.113-0.202-0.241-0.466-0.383-0.79c-0.01,0.002-0.021,0.004-0.033,0.004c-0.089,0.013-0.18,0.021-0.267,0.024
              c-0.085,0.341-0.166,0.626-0.243,0.844c-0.224-0.002-0.444-0.016-0.662-0.046c-0.043-0.231-0.084-0.519-0.12-0.869
              c-0.099-0.021-0.196-0.041-0.295-0.069c-0.185,0.3-0.348,0.542-0.49,0.727c-0.207-0.067-0.416-0.151-0.613-0.248
              c0.028-0.232,0.078-0.519,0.154-0.863c-0.089-0.05-0.174-0.102-0.261-0.157c-0.269,0.228-0.496,0.407-0.688,0.542
              c-0.179-0.133-0.35-0.274-0.509-0.428c0.098-0.211,0.235-0.471,0.415-0.775c-0.071-0.072-0.137-0.148-0.199-0.227
              c-0.326,0.133-0.603,0.232-0.826,0.302c-0.127-0.182-0.248-0.367-0.352-0.563c0.159-0.171,0.371-0.375,0.636-0.609
              c-0.044-0.091-0.083-0.184-0.121-0.278c-0.352,0.025-0.643,0.036-0.875,0.033c-0.068-0.209-0.119-0.426-0.159-0.646
              c0.203-0.113,0.466-0.239,0.79-0.383c-0.002-0.012-0.004-0.022-0.005-0.031c-0.01-0.091-0.019-0.181-0.023-0.27
              c-0.341-0.085-0.622-0.164-0.842-0.241c0-0.224,0.014-0.444,0.045-0.663c0.229-0.045,0.518-0.084,0.869-0.119
              c0.02-0.099,0.043-0.197,0.069-0.295c-0.302-0.187-0.544-0.349-0.729-0.49c0.072-0.21,0.154-0.417,0.249-0.616
              c0.232,0.029,0.521,0.082,0.865,0.155c0.05-0.087,0.101-0.173,0.156-0.258c-0.229-0.269-0.408-0.5-0.541-0.69
              c0.129-0.178,0.273-0.348,0.426-0.508c0.213,0.097,0.468,0.236,0.772,0.413c0.075-0.068,0.152-0.135,0.23-0.198
              c-0.133-0.328-0.231-0.602-0.303-0.825c0.181-0.129,0.368-0.246,0.564-0.353c0.169,0.16,0.373,0.37,0.607,0.634
              c0.091-0.042,0.185-0.082,0.278-0.118c-0.026-0.352-0.034-0.644-0.03-0.877c0.208-0.066,0.422-0.12,0.646-0.159
              c0.111,0.204,0.239,0.468,0.383,0.79c0.011,0,0.02-0.003,0.03-0.004c0.09-0.01,0.179-0.018,0.269-0.022
              c0.084-0.343,0.165-0.624,0.24-0.845c0.224,0.001,0.446,0.018,0.663,0.045c0.044,0.229,0.082,0.52,0.119,0.871
              c0.101,0.02,0.198,0.042,0.295,0.068c0.188-0.3,0.35-0.542,0.492-0.727c0.21,0.069,0.414,0.152,0.613,0.249
              c-0.028,0.231-0.08,0.52-0.156,0.865c0.091,0.049,0.178,0.1,0.261,0.154c0.27-0.227,0.501-0.406,0.691-0.54
              c0.177,0.132,0.346,0.273,0.507,0.427c-0.1,0.21-0.235,0.468-0.413,0.775c0.067,0.072,0.135,0.148,0.197,0.227
              c0.329-0.133,0.603-0.234,0.826-0.302c0.127,0.179,0.246,0.367,0.353,0.563c-0.16,0.17-0.372,0.373-0.634,0.608
              c0.041,0.091,0.082,0.185,0.118,0.278C22.466,12.777,22.757,12.77,22.989,12.773z M18.008,14.87c0.294,0.061,0.58-0.127,0.64-0.422
              c0.061-0.294-0.13-0.581-0.421-0.641c-0.293-0.06-0.58,0.129-0.641,0.423C17.524,14.523,17.714,14.81,18.008,14.87z M16.81,14.735
              c-0.323-0.966-0.974-1.616-1.456-1.458c-0.481,0.161-0.613,1.073-0.292,2.041c0.317,0.964,0.968,1.616,1.452,1.459
              C16.999,16.615,17.13,15.701,16.81,14.735z M18.758,11.225c-1-0.205-1.89,0.033-1.992,0.531c-0.104,0.498,0.621,1.068,1.618,1.274
              c0.996,0.205,1.89-0.031,1.992-0.53C20.478,12,19.752,11.431,18.758,11.225z M21.094,14.528c-0.382-0.337-1.237,0.005-1.914,0.766
              c-0.676,0.761-0.916,1.652-0.534,1.991c0.38,0.335,1.236-0.005,1.911-0.767C21.234,15.759,21.474,14.867,21.094,14.528z" />
            </g>
          </svg>
          {{system.name}}
        </div>
        <div class="description" *ngIf="system.description">{{system.description}}</div>
    </div>
    <div class="data">
      <div class="bucket" *ngFor="let user of system.data; trackBy: getTrackingKey">
        <ig-user *ngIf="user" [id]="user.id" [dragula]="'game-drop'" [user]="user"></ig-user>
      </div>
    </div>
  `,
})
export class SystemComponent implements OnInit {

  @Input() id: string;

  public system: System;

  constructor(private game: GameService) { }

  getTrackingKey(index, user) {
    return user ? user.id : index;
  }

  ngOnInit() {
    this.system = this.game.getSystem(this.id);
    if (this.game.sources.indexOf(this.id) > -1) {
      this.system.type = 'source';
    } else if (this.game.targets.indexOf(this.id) > -1) {
      this.system.type = 'target';
    } else {
      this.system.type = 'idm';
    }
  }

}
