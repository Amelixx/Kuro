const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`),
items = require(`../JSON/items.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let cooldowns = userinfo[message.author.id].cooldowns, desc = `Cooldowns for ${message.author.tag}\n\n`
    if (!cooldowns) return !await message.channel.send(`You don't have any cooldowns.`)

    let embed = new Discord.MessageEmbed()
    .setColor(`BLACK`)

    if (!userinfo[message.author.id].inventory["Crystal Ball"]) embed.setFooter(`Don't like the long cooldowns? You can reduce cooldowns to 50% of their value with the Crystal Ball!`)

    for (let cmd in cooldowns) {
        if (cooldowns[cmd] <= Date.now()) available = "**Available now.**"
        else available = `Will be available in ${await modules.getTimeString(cooldowns[cmd])}.`

        desc += `\`>${cmd}\` -> ${available}\n`
    }
    embed.setDescription(desc)
    return await message.channel.send({embed})
}

module.exports.info = {
    name: `cooldowns`,
    type: `info`,
    summary: `Shows all your current cooldowns.`,

    requiresUserinfo: true
}