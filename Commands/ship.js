const Discord = require("discord.js");

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (![`97238312355364864`].includes(message.author.id)) return message.channel.send(`Ew why would I have a ship for you?? lmfao`)
    let embed = new Discord.MessageEmbed()
    .setColor(`PINK`)
    .setTitle(`Amy <3 Kara\n Cutest Ship Ever omgomgomgomgomgomg`)
    .setThumbnail(`https://thumbs.dreamstime.com/b/love-ship-pink-boat-pink-sail-sea-hearts-37467085.jpg`)
    .setDescription(`Karaaaaaaaaaaaaaa (the more "a"s I add them more I care) and Amy are like destined to be ever since..some date like omg owo uwu`)
    .addField(`Level`, `69`, true)
    .addField(`XP`, `666/666`, true)
    .addField(`Set sail`, `like today? Well, it's technically yesterday for you guys, as this bot works in the only true timezone, GMT`)
    .setFooter(`Kara is my universe and soul, it only took one stupid pickup line that I took 5 seconds thinking of <3`)

    message.channel.send({embed})
}

module.exports.info = {
    name: `ship`
}