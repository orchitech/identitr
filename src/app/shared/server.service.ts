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
import {Http, Response, RequestOptions, Headers, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import * as md5 from 'md5';
import { Logger } from "./logger.service";

@Injectable()
export class ServerService {

  constructor(private http: Http, private logger: Logger) {
  }

  getResults(searchParams) {
    let params: URLSearchParams = new URLSearchParams();
    for (let key in searchParams) {
      params.set(key, searchParams[key]);
    }
    return this.http.get('server/results', {search: params}).
      map((res: Response) => res.json()).
      catch((error: any) => {
        this.logger.error('Server error', error);
        return Observable.throw(error);
      });
  }

  postResult(result: any) {
    result.seed = parseInt(md5([result.uid, result.score, result.time].join(':')).substring(0, 8), 16);
    let jsonBody = JSON.stringify(result);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('server/results', jsonBody, options).
      map((res: Response) => res.json());
  }

}
