const Discord = require(`discord.js`);

const fs = require(`fs`)

const userinfo = require(`../JSON/userinfo.json`)

const modules = require(`../modules.js`),
userStats = require("../JSON/Stats/userStats.json");

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let memberToSteal = await modules.fetchMember(message.guild, coreMessage)
    if (!memberToSteal || !coreMessage || !memberToSteal.user) {message.channel.send(`Couldn't find a user.`); return false}

    if (memberToSteal.user == bot.user) {message.channel.send(`Why would you want to steal from me? :cry:`); return false}
    if (memberToSteal.user.id == "834152608058572861") return message.channel.send(`That's like.. the bank. You can't rob the bank.`)
    if (memberToSteal.user.bot) {message.channel.send(`Bots don't have any money... Why would you want to steal from them?`); return false}

    if (!userinfo[memberToSteal.id]) modules.registerUser(memberToSteal)
    if (userinfo[memberToSteal.id] && userinfo[memberToSteal.id].money < 2000) {message.channel.send(`You can't steal from people with less than **$2000**.`); return false}
    else if (userinfo[message.author.id].money < 2000) {message.channel.send(`You can't steal from anyone if you have less than **$2000**.`); return false}
    
    let moneyToSteal = await modules.randomInt(250, 600); let success = await modules.randomInt(0,1)

    if (memberToSteal == message.member) {message.channel.send(`You stole **$${moneyToSteal}** from yourself! It didn't have any effect.`); return false}

    let successMessages = [
        `You crept up to ${memberToSteal.displayName} and managed to take **$${moneyToSteal}**.`,
        `You stole **$${moneyToSteal}** from ${memberToSteal.displayName}.`,
        `You managed to pickpocket **$${moneyToSteal}** from ${memberToSteal.displayName}.`
    ],
    failureMessages = [
        `You tripped while trying to rob **${memberToSteal.displayName}**, nice going Einstein.`,
        `You were caught and paid **$${moneyToSteal}** as a fine.`,
        `You were caught and fined **$${moneyToSteal}**.`,
        `${memberToSteal.displayName} caught you. You were fined **$${moneyToSteal}**.`
    ]

    if (memberToSteal.id == `97238312355364864`) success = true

    if (success) {
        await modules.addMoney(message.author, moneyToSteal)
        await modules.removeMoney(memberToSteal.user, moneyToSteal)

        if (!userStats[message.author.id].successfulRobs) userStats[message.author.id].successfulRobs = 1
        else userStats[message.author.id].successfulRobs ++

        return await message.channel.send(successMessages[await modules.randomInt(0, successMessages.length - 1)])
    }
    else {
        let messageToSend = failureMessages[await modules.randomInt(0, failureMessages.length - 1)]
        if (!failureMessages.indexOf(messageToSend) == 0) await modules.removeMoney(message.author, moneyToSteal)

        if (!userStats[message.author.id].failedRobs) userStats[message.author.id].failedRobs = 1
        else userStats[message.author.id].failedRobs ++

        return await message.channel.send(messageToSend)
    }
}

module.exports.info = {
    name: `rob`,
    type: `money`,
    summary: `Steal money from someone >:)`,

    aliases: [`steal`],

    requiresUserinfo: true,
    cooldown: 120000
}