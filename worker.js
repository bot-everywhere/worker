const { CronJob } = require('cron')
const log4js = require('log4js')
const pub = require('./publisher')

const logger = log4js.getLogger('worker')
logger.level = 'debug'

new CronJob(`*/2 * * * * *`, () => {
  pub.ping()
    .then(({ ping }) => logger.debug(`=> Ping ${ping}`))
    .catch(e => logger.error(e))
}, null, true)
