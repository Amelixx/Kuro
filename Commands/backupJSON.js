const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage) => {
    await modules.backupJSON()
    message.channel.send(`JSON backed up :thumbsup:`)
}

module.exports.info = {
    name: `backupjson`,
    developer: true
}