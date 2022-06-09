const Discord = require(`discord.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    message.channel.send(`Pong! Response time: **${Math.round(bot.ws.ping)} ms!**`)
}

module.exports.info = {
    name: `ping`,
    type: `info`,
    summary: `Pings the bot, displaying the response time of the API.`
}