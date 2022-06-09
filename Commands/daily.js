const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    await modules.addMoney(message.author, 2000)

    return await message.channel.send(`You got $2000 daily cash!`)
}

module.exports.info = {
    name: `daily`,
    type: `money`,
    summary: `Collect daily money from the bot.`,

    requiresUserinfo: true,
    cooldown: 86400000
}