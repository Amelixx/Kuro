const Discord = require("discord.js");

const colorRoles = require(`../JSON/Storage/OtakuColorRoles.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (args[1].toLowerCase() == `colorroles`) {
        message.channel.send(`Creating color roles...`)
        for (let role in colorRoles) {
            role = colorRoles[role]

            await message.guild.roles.create({data: {
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                mentionable: role.mentionable,
                permissions: 0
            }})
        }
        return message.channel.send(`Successfully setup color roles in **${message.guild.name}**!`)
    }
}

module.exports.info = {
    name: `setup`,
    developer: true
}