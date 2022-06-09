const Discord = require("discord.js");
module.exports.run = async (bot, message, args, coreMessage) => {
    let channel = message.mentions.channels.first() || bot.channels.cache.get(args[1])
    if (!channel) channel = message.channel

    let embed = new Discord.MessageEmbed()
        .setColor(`BLUE`)
        .setTitle(`Channelinfo | ${channel.name}`)
        .addField(`ID`, channel.id)
        .addField(`Created`, channel.createdAt.toDateString())
        .addField(`Channel Type`, channel.type)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    message.channel.send({embed})
}

module.exports.info = {
    name: `channelinfo`,
    type: `info`,
    summary: `Displays infomation on a specific channel or the channel it is used in.`
}