'use strict';

const Promise = require('bluebird');
const winston = require('winston');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const glob = require('glob-promise');
const forEach = require('lodash/forEach');
const express = require('express');

function load () {
  return new Promise(async (resolve, reject) => {
    try {
      const app = express();

      app.get('/', function (req, res) {
        res.send('Hello World!')
      });
      app.listen(3000, function () {
        winston.info('[WEB] Web interface listening at');
      });
      return resolve();
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = exports = load;