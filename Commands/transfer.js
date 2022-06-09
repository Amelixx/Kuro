const Discord = require(`discord.js`)
const fs = require(`fs`)

const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let userToTransfer;
    if (!args[1]) return message.channel.send(`Usage: ${prefix}transfer (user) (amount)`)
    if (message.guild) member = modules.getMember(message.guild, args[1], message.channel)
    else userToTransfer = modules.getUser(args[1], message.channel)
    if (userToTransfer == undefined && member == undefined) return;
    else if (member != undefined) userToTransfer = member.user

    if (!userToTransfer) return;
    else if (userToTransfer.bot && userToTransfer.id != `834152608058572861`) return message.channel.send(`You can't give money to bots.`)

    let moneyToTransfer = Number(args[2]); 
    if (isNaN(args[2])) return message.channel.send(`Enter a number for the amount to transfer.`)
    
    if (String(moneyToTransfer).startsWith(`0`) || Number(moneyToTransfer) < 1) return message.channel.send(`Invalid amount.`)

    let currentAuthorMoney = userinfo[message.author.id].money; if (!userinfo[message.author.id].money) currentAuthorMoney = 0

    if (parseInt(moneyToTransfer) > parseInt(currentAuthorMoney)) return message.channel.send(`You don't have enough money to give!`)
    if (userToTransfer == message.author) return message.channel.send(`Successfully transferred **$${moneyToTransfer}** to yourself! It didn't have any effect, surprisingly.`)

    modules.removeMoney(message.author, moneyToTransfer)
    modules.addMoney(userToTransfer, moneyToTransfer)

    message.channel.send(`Transferred **$${moneyToTransfer}** to **${message.guild.member(userToTransfer).displayName}**.`)
}

module.exports.info = {
    name: `transfer`,
    type: `money`,
    summary: `Transfers a certain amount of money from one user to another.`,
    ignoreDM: true,

    requiresUserinfo: true,

    help:
`Use **%PREFIX%transfer (user) (amount)** to transfer money.`
}