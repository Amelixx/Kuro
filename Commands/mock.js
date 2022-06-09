const Discord = require("discord.js");

const modules = require(`../modules.js`)
module.exports.run = async (bot, message, args, content, prefix) => {
    if (!content) return message.channel.send(modules.mOcK("You need to actually send a message to edit."))

    return await message.channel.send(modules.mOcK(content))
}

module.exports.info = {
    name: `mock`,
    type: `fun`,
    summary: `Make a sentence have random capital letters, for a great effect`,
}