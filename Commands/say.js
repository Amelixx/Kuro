const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.deletable) message.delete()
    message.channel.send(coreMessage)
}

module.exports.info = {
    name: `say`,
    type: `fun`,
    summary: `Makes the bot say something.`
}
