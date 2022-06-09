const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)

const userStats = require(`../JSON/Stats/userStats.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setColor([62, 0, 116])
        .setTitle(`Credits\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**`)
        .setDescription(`**${bot.users.cache.get("97238312355364864").tag}** - Uh, did everything that isn't mentioned here, what did you expect?\n\n` + 
                        `**${bot.users.cache.get("286756561848762378").tag}** - Gave the idea for **search**, **blocktext**, **__SOME__** messages for **search**, increased Kuro's guild count, and insulted Kuro constantly so I would continue to improve her.\n\n`+ 
                        `**${bot.users.cache.get(`368516532805959680`).tag}** - Clearly way too addicted to discord bots, with the most commands used out of anyone else... **(${userStats[`368516532805959680`][`Command Usage`].total} commands)**\n\n` + 
                        `**${bot.users.cache.get("97238312355364864").username}'s cat** - Emotional Support <3`)

    message.channel.send({embed})
}

module.exports.info = {
    name: `credits`,
    type: `info`,
    summary: `A list of special people that helped make Kuro`
}