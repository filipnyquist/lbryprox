require('app-module-path').addPath(__dirname)
const config = require('config')
const os = require('os')
const path = require('path')
const winston = require('winston')
const Promise = require('bluebird')
const packageInfo = require('package.json')

async function startup () {
  try {
    // ========================================
    // initialize env manager.
    // ========================================
    require('app/env.js')

    // ========================================
    // initialize log manager.
    // ========================================
    require('app/log/logger.js')('server')

    // ========================================
    // print startup banner.
    // ========================================
    winston.info('[APP] starting up lbryprox version: %s [%s]', packageInfo.version, env) // eslint-disable-line no-undef
    winston.info('[APP] running on: %s-%s [%s %s]', os.platform(), os.arch(), os.type(), os.release())
    winston.info('[APP] node: %s, v8: %s, uv: %s', process.versions.node, process.versions.v8, process.versions.uv)
    winston.info('[APP] running over %d core system', os.cpus().length)

    // ========================================
    // database manager.
    // ========================================
    const db = await require('app/db/mongodb.js')()

    // ========================================
    // daemon manager.
    // ========================================
    await require('app/daemon.js')()

    // ========================================
    // web manager.
    // ========================================
    require('app/web.js')(db)
  } catch (err) {
    winston.error('startup error: %s', err)
  }
}

startup()
