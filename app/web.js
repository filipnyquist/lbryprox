const Promise = require('bluebird')
const winston = require('winston')
const mongoose = require('mongoose')
const path = require('path')
const config = require('config')
const glob = require('glob-promise')
const forEach = require('lodash/forEach')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

function init (db) {
  app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
  })
  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../public')))

  http.listen(config.get('web.port'), () => {
    winston.info(`[WEB] Webserver listening on *:${config.get('web.port')}`)
  })
}

module.exports = exports = init
