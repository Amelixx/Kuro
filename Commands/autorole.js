const Discord = require(`discord.js`)
const fs = require(`fs`);

const modules = require(`../modules.js`)
const guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    if (!args[1] || !args[2]) return message.channel.send(modules.createHelp(this, prefix))

    else if (args[1].toLowerCase() == `disable`) {
        if (!guildinfo[message.guild.id].autoRoles) return message.channel.send(`Autorole isn't enabled for this server.`)
        
        delete guildinfo[message.guild.id].autoRoles
        return message.channel.send(`Autorole disabled.`)
    }

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
    if (!role) role = await modules.fetchRole(content.replace(`${args[1]} `, ``), message.guild, true)
    if (!role) return message.channel.send(`Please specifiy a valid role. (Mention the role, supply the name, or supply the ID)`)

    if (args[1].toLowerCase() == `members`) {
        if (!guildinfo[message.guild.id].autoRoles) {
            guildinfo[message.guild.id].autoRoles = { newMemberRole: role.id }
        }
        else guildinfo[message.guild.id].autoRoles.newMemberRole = role.id
        fs.writeFile(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4), err => {})
    }
    else if (args[1].toLowerCase() == `bots`) {
        if (!guildinfo[message.guild.id].autoRoles) {
            guildinfo[message.guild.id].autoRoles = { newBotRole: role.id }
        }
        else guildinfo[message.guild.id].autoRoles.newBotRole = role.id
        fs.writeFile(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4), err => {})
    }

    return message.channel.send(`Autorole for ${args[1]} has been set to **"${role.name}"**`)
}

module.exports.info = {
    name: `autorole`,
    aliases: [`setautorole`, `autoroles`],
    type: `config`,
    summary: `Set automatic role assignments for new humans or bots joining the server.`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_ROLES`],
    botPermissions: [`MANAGE_ROLES`]
}

module.exports.help = 
`To set an autorole for new members, use **%PREFIX%autorole members (role mention, roleID, or part of the name.)**
For example, a role called 'Members' can be selected by typing **"%PREFIX%autorole members memb"**

To set an autorole for any bots that join the server, use **%PREFIX%autorole bots (role mention, roleID, or part of the name)**
Used in the same way as **%PREFIX%autorole members**

To disable autorole, use **%PREFIX%autorole disable**

If Kuro isn't giving any roles, check that Kuro has permission to manage roles and that the roles being given aren't higher than Kuro's highest role.
If you think there is a bug, report it on Kuro's official server.`