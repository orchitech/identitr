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
var express = require('express');

var app = express();
require('./setup')(app);

app.use(express.static('dist'));

var http = require('http');
var server = http.createServer(app);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
server.listen(PORT, HOST);
server.on('listening', function() {
  console.log('Server listening on %s:%d...', HOST, PORT);
});
