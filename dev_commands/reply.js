const Discord = require(`discord.js`)
const fs = require(`fs`);

const globalStats = require(`../JSON/Stats/globalStats.json`),
config = require(`../JSON/settings.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    message.delete()
    let user = bot.users.cache.get(globalStats.lastDM);
    if (!user) return message.channel.send(`Couldn't find a user to reply to. Use ${prefix}send (User ID) instead.`)

    user.send(content).catch(e => {})

    let embed = new Discord.MessageEmbed()
    .setColor(`BLACK`)
    .setAuthor(`${message.author.tag} replied to ${user.tag}`, message.author.displayAvatarURL)
    .setDescription(content)
    .setTimestamp(Date.now())

    bot.channels.cache.get(config.dmLogChannel).send({embed})
}

module.exports.info = {
    name: `reply`,
    support: true,
    noHelp: true
}