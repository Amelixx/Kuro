const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let userToBan;
    if (message.guild) userToBan = modules.getMember(message.guild, args[1], message.channel)

    if (!userToBan) return message.channel.send(`I can't find a user matching '${coreMessage}'`)
    if (!userToBan.bannable) return message.channel.send(`:x: I don't have permission to ban this user.`)

    if (message.author != bot.users.get(`97238312355364864`)) {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`:x: You don't have permission to use this command.`)
        if (userToBan.highestRole.position >= message.member.highestRole.position) return message.channel.send(`:x: You don't have permission to ban this user.`)
    }

    let reason = await coreMessage.replace(`${args[1]} `, ``)
    if (reason == args[1]) reason = null
    if (!reason) reason = `No reason specified.`
    
    if (!userToBan) return message.channel.send(`Usage: \`${prefix}ban [@User]\``)
    if (!userToBan.user.bot) await userToBan.send(`You were banned from ${message.guild.name} by ${message.author.tag}.\nReason: ${reason}`)

    await message.guild.members.ban(userToBan, {reason:reason})

    if (await userToBan.guild.members.cache.get(userToBan.user.id)) return message.channel.send(`:x: User was not banned.`)
    else if (await !userToBan.guild.members.cache.get(userToBan.user.id)) message.channel.send(`Successfully banned ${userToBan.user.tag}.\nReason: ${reason}`)
    
}

module.exports.info = {
    name: `ban`,
    type: `admin`,
    summary: `Bans a specfied user.`,
    help:
    `You can ban a user with **%PREFIX%ban (@user)**.
    Optionally, you can add a reason with **%PREFIX%ban (@user) (reason)`
}