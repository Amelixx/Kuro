const Discord = require(`discord.js`)
const fs = require(`fs`);

const guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    if (message.author.id != `97238312355364864` && !message.member.hasPermission(`MANAGE_GUILD`)) {
        return message.channel.send(`:x: You don't have permission to use this command.\nMissing permissions: 'Manage Server'`) }
    if (!content) return message.channel.send(`Usage: \`${prefix}prefix <New server prefix>\`\nDon't include the <> brackets.`)

    guildinfo[message.guild.id].prefix = args[1]
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))

    return message.channel.send(`Prefix for ${message.guild.name} has been to set to \`${args[1]}\`.`)
}

module.exports.info = {
    name: `prefix`,
    aliases: [`setprefix`, `newprefix`],
    type: `config`,
    summary: `Set the prefix for the server!`,

    requiresGuildinfo: true
}