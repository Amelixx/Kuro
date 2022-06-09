const Discord = require(`discord.js`);
const fs = require(`fs`)
const settings = require(`../JSON/settings.json`)

const chalk = require(`chalk`)

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!args[1]) return message.channel.send(`Actually give me something to search for, :b:`)
    let array = bot.users.cache.filter(x => x.username.toLowerCase().startsWith(coreMessage.toLowerCase())).array()
    let string = ""
    let botString = ""
    let discordBotList = ""
    array.forEach(x => {
        if (x.bot) botString += `\`${x.tag}\` `
        else if (bot.guilds.cache.get("264445053596991498").member(x.id)) discordBotList += `\`${x.tag}\` `
        else string += `\`${x.tag}\` `
    })

    if (string.length > 2048) {
        string = `Too many users to list.\nUsers found: **${array.length}**`
    }

    if (!string) string = `No humans found (that aren't in DBL)`

    if (botString > 1024) {
        botString = `Too many bots to list.\nBots found: **${array.length}**`
    }

    if (!botString) botString = `No bots found.`
    if (!discordBotList) discordBotList = `No one found :(`

    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`Users which usernames start with '${coreMessage.toLowerCase()}'`)
        .setDescription(`**Humans**\n${string}`)
        .addField(`People I found on Discord Bot List`, discordBotList)
        .addField(`Bots`, botString)
    message.channel.send({embed})
}

module.exports.info = {
    name: `finduser`,
    type: `fun`,
    summary: `Find a user on Kuro by the start of their username!`
}

async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}