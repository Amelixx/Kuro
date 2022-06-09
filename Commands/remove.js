const Discord = require("discord.js");

const colorRoles = require(`../JSON/Storage/colorRoles.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (args[1].toLowerCase() == `colorroles`) {
        message.channel.send(`Removing roles...`)
        for (let role in colorRoles) {
            role = colorRoles[role]

            guildRole = message.guild.cache.roles.find(x => {return x.name == role.name})

            if (!guildRole) continue

            await guildRole.delete()
        }
        return message.channel.send(`Successfully removed color roles in **${message.guild.name}**!`)
    }
}

module.exports.info = {
    name: `remove`,
    developer: true
}