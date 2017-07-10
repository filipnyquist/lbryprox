/*
 *  Daemon controller, this file will contain all the logic to start, attach, and control the daemon.
 */
const Promise = require('bluebird')
const winston = require('winston')
const request = require('request')
const rp = require('request-promise')
const fs = require('fs')
const os = require('os')
const unzip = require('unzip')

function getLatestDownloadUrl () {
  return new Promise(async (resolve, reject) => {
    try {
      let osi
      switch (os.platform()) {
        case 'linux':
          osi = 0
          break
        case 'darwin':
          osi = 1
          break
        case 'win32':
          osi = 2
          break
        default:
          winston.info('[DAEMON] Could not determine your os version.')
      }
      const options = {
        uri    : 'https://api.github.com/repos/lbryio/lbry/releases/latest',
        headers: {
          'User-Agent': 'LBRYprox',
        },
        json: true,
      }
      rp(options).then(({ assets }) => resolve(assets[osi].browser_download_url))
    } catch (err) {
      return reject(err)
    }
  })
}

function downloadGit (url) {
  return new Promise(async (resolve, reject) => {
    try {
      winston.info('[DAEMON] Could not find the daemon, downloading for %s.', os.platform())
      const dl = request(url).pipe(fs.createWriteStream('daemon/daemon.zip'))
      dl.on('finish', () => {
        winston.info('[DAEMON] Downloaded the daemon, unzipping...')
        fs.createReadStream('daemon/daemon.zip').pipe(unzip.Extract({ path: 'daemon/' })).on('close', () => {
          fs.unlink('daemon/daemon.zip', err => {
            if (err) throw err
            winston.info('[DAEMON] Daemon unzipped, starting...')
            return resolve()
          })
        })
      })
    } catch (err) {
      return reject(err)
    }
  })
}

function checkIfDaemonExists () {
  return new Promise((resolve, reject) => {
    try {
      if (os.platform() === 'win32') {
        fs.stat('daemon/lbrynet-daemon.exe', (error, file) => {
          if (!error && file.isFile()) {
            return resolve(true)
          }

          if (error && error.code === 'ENOENT') {
            return resolve(false)
          }
        })
      } else {
        fs.stat('daemon/lbrynet-daemon', (error, file) => {
          if (!error && file.isFile()) {
            return resolve(true)
          }

          if (error && error.code === 'ENOENT') {
            return resolve(false)
          }
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

async function init () {
  return new Promise(async (resolve, reject) => {
    try {
      const daemonExists = await checkIfDaemonExists()
      if (!daemonExists) {
        const latestDownloadUrl = await getLatestDownloadUrl()
        await downloadGit(latestDownloadUrl)
        resolve()
      } else {
        winston.info('[DAEMON] Found daemon, starting it...')
        // TODO: add controller here when daemon is fixed...
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = exports = init
