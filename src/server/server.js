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

var router = express.Router();

var md5 = require('md5');

var connectionString = process.env.DB_CONNECTION || 'postgres://identitr:identitr@localhost:5432/identitr';
var pgp = require('pg-promise')();
var db = pgp(connectionString);

router.get('/results', function (req, res) {
  var bindings = {
    limit: req.query.limit || 10,
    from: req.query.from || '1970-01-01',
    to: req.query.to || '2099-12-31'
  };
  db.many(
    'SELECT\
      name,\
      uid,\
      MAX(score) AS score,\
      MAX(play_time) AS time,\
      SUM(score) AS totalScore,\
      SUM(play_time) AS totalPlayTime,\
      COUNT(*) AS gamesPlayed\
    FROM score\
    WHERE\
      hidden IS FALSE AND\
      created_on BETWEEN ${from} AND ${to}\
    GROUP BY name, uid\
    ORDER BY score DESC\
    LIMIT ${limit};', bindings
  ).
    then(function (rows) {
    db.one(
      'SELECT\
        SUM(play_time) AS time,\
        SUM(score) AS score,\
        COUNT(*) AS games\
      FROM score\
      WHERE\
        hidden IS FALSE AND\
        created_on BETWEEN ${from} AND ${to}', bindings
    ).
      then(function (data) {
        res.json({
          results: rows,
          totals: data
        });
      });
    });
});

router.post('/results', function (req, res) {
  var data = req.body;
  var messages = [];

  if (req.headers['http_x_requested_with'] != 'XMLHttpRequest') {
    messages.push({ source: 'headers', code: 'invalidValue' });
  }
  if (!data.player) {
    messages.push({ source: 'player', code: 'required' });
  }
  if (typeof data.player != 'string' || data.player.length > 64) {
    messages.push({ source: 'player', code: 'invalidValue' });
  }
  if (data.time !== parseInt(data.time, 10) || parseInt(data.time, 10) < 0) {
    messages.push({ source: 'time', code: 'invalidValue' });
  }
  if (data.score !== parseInt(data.score, 10) || parseInt(data.score, 10) < 0) {
    messages.push({ source: 'score', code: 'invalidValue' });
  }
  if (!data.uid) {
    messages.push({ source: 'uid', code: 'invalidValue' });
  }

  if (messages.length) {
    res.status(400).json(messages);
    return;
  }

  // A bit of security through obscurity ... :/
  var seed = parseInt(md5([data.uid, data.score, data.time].join(':')).substring(0, 8), 16);
  var binding = {
    name: data.player,
    score: data.score,
    play_time: data.time,
    uid: data.uid,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    hidden: seed != data.seed
  };
  db.query('INSERT INTO score(name, score, uid, play_time, user_agent, ip_address, hidden) ' +
      'VALUES(${name}, ${score}, ${uid}, ${play_time}, ${user_agent}, ${ip_address}, ${hidden})', binding);

  res.json('Ok');
});

module.exports = router;
