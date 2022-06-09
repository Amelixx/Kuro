const Discord = require(`discord.js`)
const fs = require(`fs`);
const userinfo = require(`../JSON/userinfo.json`),
modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!userinfo[message.author.id].marriagePartner) return message.channel.send(`You aren't married to anyone!`)

    let partnerID = userinfo[message.author.id].marriagePartner
    let partner = bot.users.cache.get(partnerID)

    message.channel.send(`${message.author.username} and ${partner.username} are no longer married.. Rip in the chat.`)

    let embed = modules.addAchievements(message.author, ["Heartbreaker"])
    if (embed) message.channel.send({embed})

    embed = modules.addAchievements(partner, ["Heartbreak"])
    if (embed) partner.send({embed})

    delete userinfo[partnerID].marriagePartner
    delete userinfo[message.author.id].marriagePartner

    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));
}

module.exports.info = {
    name: `divorce`,
    type: `fun`,
    summary: `Deletes your partner from the marriages database. Harsh >_>`,

    requiresUserinfo: true
}