let Discord = require('discord.js')

const main = require(`../Kuro.js`)

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {*} args 
 * @param {*} content 
 * @param {*} prefix 
 */
module.exports.run = async (bot, message, args, content, prefix, clone) => {
    let Corner = bot.guilds.cache.get("366204534567075840");

    if (message.guild.id === Corner.id && clone !== 1) return;

    if (!Corner.members.cache.has(message.author.id)) return message.channel.send("This command can only be run if you're a member of Rubix's Corner. Join here: https://discord.gg/HhfeW8N")

    let rubixThoughts = Corner.roles.cache.get("867383890338643999"),
    member = Corner.member(message.author)

    if (member.roles.cache.has(rubixThoughts.id)) {
        member.roles.remove(rubixThoughts);
        message.channel.send(`You have been unsubscribed from the critically acclaimed rubix thoughts. To join back, just run this command again.`)
    } else {
        member.roles.add(rubixThoughts)
        message.channel.send(`You have subcribed to the critically acclaimed rubix thoughts. To unsubscribe, run this command again.`)
    }
}

module.exports.info = {
    name: `rubixthoughts`,
    noHelp: true
}