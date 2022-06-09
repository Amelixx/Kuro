const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    await modules.addMoney(message.author, 25000)

    return await message.channel.send(`You got $25000 weekly cash!`)
}

module.exports.info = {
    name: `weekly`,
    type: `money`,
    summary: `Collect weekly money from the bot.`,

    requiresUserinfo: true,
    cooldown: 604800000 // 1 week
}