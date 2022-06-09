const Discord = require(`discord.js`);
const fs = require(`fs`)

const guildinfo = require(`../JSON/guildinfo.json`),
modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content) => {
    if (!args[1]) return message.channel.send(`Missing the channel parameter.\nYou can select a channel by a mention, ID, or the name. Alternatively, use "here" to select the current channel.`)
    let channel = await modules.fetchChannel(content, message.guild)
    if (!channel) return message.channel.send(`I couldn't find a channel matching '${args[1]}'..`)

    guildinfo[message.guild.id].broadcastChannel = channel.id
    fs.writeFile(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4), err => {})
    message.channel.send(`I'll now send broadcasts only in ${channel}. :thumbsup:`)
}

module.exports.info = {
    name: `broadcastchannel`,
    aliases: [`bc`],
    type: `config`,
    summary: `Sets updates/messages from the developer to a specific channel.`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_SERVER`]
}