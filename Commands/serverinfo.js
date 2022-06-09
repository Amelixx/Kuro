const Discord = require(`discord.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let guild = await bot.guilds.cache.get(args[1])
    if (await !guild) bot.guilds.cache.forEach(async (parameterGuild) => {if (parameterGuild.name.startsWith(coreMessage)) guild = await parameterGuild })
    if (!guild) guild = await message.guild

    let guildCounts = countGuildProperties(guild)
    let guildRoles = listGuildRoles(guild)

    let roleField = new String(`${guildRoles.list}\n${guildRoles.count} roles.`)

    if (await guildRoles.list.length > 1024) roleField = `Too many roles to list.`

    

    let embed = new Discord.MessageEmbed()
    .setColor('BLACK')
    .setTitle(`Server Info | ${guild.name}`)
    .setThumbnail(guild.iconURL)
    .addField(`ServerID`, guild.id, true)
    .addField(`Created on`, guild.createdAt.toDateString(), true)
    .addField(`Owner`, `${guild.owner}`, true)
    .addField(`Humans`, guildCounts.members, true)
    .addField(`Bots`, guildCounts.bots, true)
    .addField(`Administrators`, guildCounts.admins, true)
    .addField(`Text | Voice Channels`, `${guildCounts.textChannels} | ${guildCounts.voiceChannels}`)
    .addField(`Roles`, roleField)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    message.channel.send({embed})
}

module.exports.info = {
    name: `serverinfo`,
    ignoreDM: true,
    type: `info`,
    summary: `Displays infomation on a particular server or the current server.`
}

function countGuildProperties(guild) {
    let guildCounts = {
        members: 0,
        bots: 0,
        admins: 0,
        textChannels: 0,
        voiceChannels: 0
    }

    guild.members.cache.forEach(async (member) => {
        if (member.user.bot) guildCounts.bots ++
        else guildCounts.members ++
        if (member.hasPermission(`ADMINISTRATOR`) && !member.user.bot) guildCounts.admins ++
    })

    guild.channels.cache.forEach(async (channel) => {
        if (channel.type == `text`) guildCounts.textChannels ++
        else guildCounts.voiceChannels ++
    })
    return guildCounts
}

function listGuildRoles(guild) {
    let roleList = []
    let count = 1
    let roleCount = 0
    guild.roles.cache.forEach(async (role) => {roleCount ++})

    guild.roles.cache.forEach(async (role, id) => {
        if (role.name == `@everyone`);
        else if (count == 0) roleList = role
        else roleList = roleList + '  ' + role
        count ++

        //Scrapped ideas for getting roles from a server:
        
        // if (await role.name == `@everyone`);
        // else if (await role.position === count && count == 1) { roleList = await role; await count ++ }
        // else if (await role.position === count && count != 1) { roleList = await roleList + '  ' + role; await count ++ }
        
        // console.log(`${role.position} | ${count}`)

        // if (role.name == `@everyone`);
        // else if (count == 1) roleList = guild.roles.find(`position`, count)
        // else roleList = roleList + ` ` + guild.roles.find(`position`, count)

        // if (guild.roles.find(`position`, count) == null);
        // await count ++
    })

    guildRoles = {
        list: roleList,
        count: roleCount
    }
    return guildRoles
}