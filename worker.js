const { CronJob } = require('cron')
const log4js = require('log4js')
const mon = require('./monitor')
const pub = require('./publisher')

const logger = log4js.getLogger('worker')
logger.level = 'debug'

let jobs = []
let controls = []

new CronJob(`*/2 * * * * *`, async() => {
  /* Pull my jobs */
  if (!mon.pendingProcess()) {
    /* Report results */
    /* Start a new job */
    const { jobs } = await pub.jobs(process.env.MAX_JOBS)
    logger.debug(`=> Run ${jobs.length} jobs`)
    mon.start(jobs)
  } 
  /* Send report to server */
  const { ping } = await pub.ping()
  logger.debug(`=> Ping ${ping}`)
}, null, true)
