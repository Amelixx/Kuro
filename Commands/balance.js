const Discord = require(`discord.js`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, content) => {
    let user, member;
    if (!content) user = message.author
    else {
        if (message.guild) member = modules.getMember(message.guild, args[1], message.channel)
        else user = modules.getUser(args[1], message.channel)
        if (user == undefined && member == undefined) return;
        else if (member != undefined) user = member.user
    }

    if (!user && !member) return;
    if (member) name = member.displayName
    else name = user.username
    let userMoney = userinfo[user.id].money

    if (user == await message.author) return message.channel.send(`:dollar: You have $${userMoney.toLocaleString()}.`)
    else await message.channel.send(`:dollar: ${name} has $${userMoney.toLocaleString()}.`)
}

module.exports.info = {
    name: `balance`,
    type: `money`,
    summary: `Displays a specfied user's money based off Kuro's economy system.`,
    requiresUserinfo: true,
    aliases: [`bal`]
}