const Discord = require("discord.js");
const fs = require(`fs`);

const userinfo = require(`../JSON/userinfo.json`),
userStats= require(`../JSON/Stats/userStats.json`)

const modules = require(`../modules.js`)
module.exports.run = async (bot, message, args, content, prefix) => {
    if (!content) return message.channel.send(`You need to tell me who you want to marry, you dumbo.`)
    if (userinfo[message.author.id].marriagePartner) return message.channel.send(`You're already married to someone... Cute.`)
    // let memberToMarry = await modules.fetchMember(message.guild, content)

    let memberToMarry = modules.getMember(message.guild, content, message.channel)
    if (!memberToMarry) return;

    if (!userinfo[memberToMarry.id]) modules.registerUser(memberToMarry)
    if (userinfo[memberToMarry.id].marriagePartner && memberToMarry.user.bot) return message.channel.send(`Yeah.. someone already took that bot. Sorry.`)
    else if (userinfo[memberToMarry.id].marriagePartner) return message.channel.send(`Uh.. **${memberToMarry.displayName}** is already married... `)

    if (memberToMarry.user.id == `386868728098324481`) return message.channel.send(`Y-You can't marry me you pervert!`)
    else if (memberToMarry.id == `451836763464400906`) return message.channel.send(`You want to marry my sister?? No.`)
    else if (memberToMarry.id == `565175024143564840`) return message.channel.send(`Well, I could go on a rant about how Warbot isn't actually a bot personality made by Rubix, more of a strategy game, making it not make sense to marry it, but instead he'll just probably code me to say something like 'Ewww that's my brother no ew'.`)

    if (userinfo[memberToMarry.id].marriagePartner) return message.channel.send(`**${memberToMarry.displayName}** is already married..`)

    let shouldMarry = true
    if (memberToMarry.user.bot) {
        message.channel.send(`Fine. I'll allow you to forcibly marry this bot since it can't really consent otherwise.\nCongratulations. **${message.author}** just married ${memberToMarry}.`)
    }
    else if (memberToMarry == message.member) {
        let msg = await message.channel.send(`:confetti_ball: :wedding: To the bride! To the lonely! To... yourself.`)
        await modules.delay(2)
        msg.edit(`:confetti_ball: :wedding: To the bride! To the lonely! To... yourself.\n\n*You're a strange person.*`)
    }
    else {
        await message.channel.send(`<a:loveparrot:460507059780321281> ${memberToMarry}, ${message.author} just proposed to you... Say "yes" or "no" to answer!`)
        console.log(memberToMarry)
        let messages = await message.channel.awaitMessages(msg => {return (msg.author.id == "97238312355364864" && msg.content.toLowerCase() == "forceyes") || (msg.author.id == memberToMarry.id && ["yes", "no", "f off", "fuck off", "forceyes"].includes(msg.content.toLowerCase()))}, {max: 1, time: 600000})
        console.log(messages)
        if (!messages.first()) {
            return message.channel.send(`Huh. ${memberToMarry} refused to even say "yes" or "no". Try again if you really want him/her/it.`)
        }
        else {
            switch(messages.first().content.toLowerCase()) {
                case "no": case "fuck off": case "f off":
                    message.channel.send(`Damn... Rip in the chat for ${message.author}...`)
                    shouldMarry = false
                    break;

                case "yes": 
                    message.channel.send(`<a:purpleHeart:499288775453704212> Congratulations. ${memberToMarry.displayName} and ${message.author.username} are now married. :confetti_ball: `)
                    break;

                case "forceyes":
                    message.channel.send(`Uhm, I know this is kinda illegal, but Rubix just forced you to marry anyway.. soo.... :heart: You're married! :confetti_ball:`)
                    break;
            }
        }
    }
    if (shouldMarry) marry(message.author, memberToMarry)

    return console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));
}

marry = (user, user2) => {
    userinfo[user.id].marriagePartner = user2.id
    userinfo[user2.id].marriagePartner = user.id
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));
}

module.exports.info = {
    name: `marry`,
    type: `fun`,
    summary: `Partner with someone! <3`,
    ignoreDM: true,

    requiresUserinfo: true
}