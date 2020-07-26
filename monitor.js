const { fork } = require('child_process')
const path = require('path')
const log4js = require('log4js')

const logger = log4js.getLogger('worker')
logger.level = 'debug'

class Monitor {
  constructor() {
    this.processes = []
    this.tasks = []
  }

  pendingTask() {
    return this.tasks.length
  }

  pendingProcess() {
    this.processes = this.processes.filter(({ pid, killAt }) => {
      if (Date.now() > killAt) {
        /* Kill process if it is timeout */
        try { process.kill(pid, 'SIGINT') } catch(e) {}
        return false
      }
      return true
    })
    return this.processes.length
  }

  start(jobs) {
    jobs.forEach(({ id, action, payload, timeout }) => {
      const file = path.join(__dirname, process.env.JOBS_DIR, `${action}.js`)
      const { pid } = fork(file, {
        env: {
          ACTION: action,
          PAYLOAD: payload,
        }
      })
      this.processes.push({
        pid,
        killAt: Date.now() + timeout * 1000
      })
    })
  }
}

module.exports = new Monitor() 
