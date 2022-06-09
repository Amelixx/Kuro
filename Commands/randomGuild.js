const Discord = require("discord.js");

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.channel.parentID == `403636693254799362`) return "***STOP USING RANDOM GUILD HERE EEEEEEEEEE***"

    let guild = bot.guilds.cache.random()

    let invites = await guild.fetchInvites()
    let invite = invites.find(x => x.maxAge == 0) || invites.find(x => x.maxUses == 0)
    
    if (invite) message.channel.send(`I found an invite to **${guild.name}**!\nhttps://discord.gg/${invite.code}`)
    else message.channel.send(`I couldn't find an invite to a server called **${guild.name}**, try the command again!`)
}

module.exports.info = {
    name: `randomguild`,
    type: `fun`,
    summary: `Gives you an invite to a random server!`,

    developer: true,
    noHelp: true
}