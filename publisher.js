const { GraphQLClient } = require('graphql-request')
const assert = require('assert')
const os = require('os')
const crypto = require('crypto')
const Chance = require('chance')

const nets = os.networkInterfaces()
const bot = {}

for (key in nets) {
  const net = nets[key].find(x => x.mac != '00:00:00:00:00:00')
  if (net) {
    bot.id = crypto.createHash('md5').update(net.mac).digest('hex').slice(0, 9)
    bot.name = new Chance(bot.id).name()
    bot.pendingProcess = 0
    bot.pendingTask = 0
  }
}

assert(bot.id)
const options = { headers: { ['bot-id']: bot.id } }
const endPoint = new GraphQLClient(process.env.PUBLISHER_URL, options)

module.exports = {
  ping() {
    const mutation = `
      mutation {
        ping(input: {
          name: "${bot.name}"
          pendingTask: ${bot.pendingTask} 
          pendingProcess: ${bot.pendingProcess}
        })
      }
    `
    return endPoint.request(mutation)
  },
  jobs(first = 10) {
    const query = `
      query {
        jobs(first: ${first}) {
          id
          action
          payload
          timeout
        }
      }
    `
    return endPoint.request(query)
  }
}
