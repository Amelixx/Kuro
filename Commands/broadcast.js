const Discord = require(`discord.js`);
const fs = require(`fs`)

const guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args) => {
    let guild = guildinfo[message.guild.id]
    if (!args[1]) {
        if (!guild.broadcast) {message.channel.send(`Enabled broadcasts on this server.`); guildinfo[message.guild.id].broadcast = true}
        else {message.channel.send(`Disabled broadcasts on this server.`); guildinfo[message.guild.id].broadcast = false}
    }
    else if (args[1].toLowerCase() == `enable`) {
        if (!guildinfo[message.guild.id].broadcast) {message.channel.send(`Enabled broadcasts on this server.`); guildinfo[message.guild.id].broadcast = true}
        else return message.channel.send(`Broadcasts for this server are already enabled!`)
    }
    else if (args[1].toLowerCase() == `disable`) {
        if (guildinfo[message.guild.id].broadcast) {message.channel.send(`Disabled broadcasts on this server.`); guildinfo[message.guild.id].broadcast = false}
        else return message.channel.send(`Broadcasts for this server are already disabled!`)
    }
    else return message.channel.send(`Type **${prefix}broadcast enable/disable** to enable/disable broadcasts respectively.\nAlternatively, typing just **${prefix}broadcast** will toggle it on/off depending on the current setting.`)
    return fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))
}

module.exports.info = {
    name: `broadcast`,
    aliases: [`togglebroadcast`, `togglebc`, `setbroadcast`],
    type: `config`,
    summary: `Turn updates/messages from the developer on/off.`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_SERVER`]
}