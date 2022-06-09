const Discord = require(`discord.js`)
const fs = require(`fs`);

const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)
const items = require(`../JSON/items.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!userinfo[message.author.id].inventory[`Fishing Rod`] && !userinfo[message.author.id].inventory[`Golden Fishing Rod`]) {message.channel.send(`You need to have a fishing rod to fish!`); return false}

    let success = modules.randomInt(0,10) < 7, item;

    num = modules.randomInt(0,100);
    if (userinfo[message.author.id].inventory["Golden Fishing Rod"]) {
        if (num < 35) item = "Blowfish"
        else if (num < 58) item = "Tropical Fish"
        else if (num < 76) item = "Shark"
        else if (num < 89) item = "Crocodile"
        else if (num < 97) item = "Giant Squid" // 7%
        else item = "Whale" // 3%
    }
    else {
        if (num < 62.5) item = "Fish"
        if (num < 87.5) item = "Blowfish"
        else item = "Tropical Fish"
    }

    let failureMessages = new Array(
        `You only found trash.`,
        `Nothing took your bait.`,
        `The bait was eaten before you could reel in.`,
        `Hiraeth ate your fish before you managed to reel in it in, who's Hiraeth? A cannibal.`,
        `What's this? A boot? I don't think that's what you were fishing for.`
    )

    if (success) {
        modules.addToInventory(message.author, item, 1)
        if (item == "Whale") {
            msg = `<:goldenfishingrod:714092500641513493> **Ultra Rare!** You caught a **${item}**! ${items[item].emoji}:tada:`
            let embed = modules.addAchievements(message.author, ["Whale of a Time"])
            if (embed) message.channel.send({embed})
        }
        else if (items[item].type == "large_fish") msg = `<:goldenfishingrod:714092500641513493> Oh my, you managed to catch a **${item}**! ${items[item].emoji}:tada:`
        else msg = `:fishing_pole_and_fish: You caught a ${item}! ${items[item].emoji}`

        return await message.channel.send(msg)
    }
    else if (userinfo[message.author.id].inventory[`Golden Fishing Rod`]) {
        modules.addToInventory(message.author, "Fish", 1)
        return await message.channel.send(`:fishing_pole_and_fish: You only got a simple fish. :fish:`)
    }
    else return await message.channel.send(failureMessages[modules.randomInt(0, failureMessages.length - 1)])
}

module.exports.info = {
    name: `fish`,
    type: `money`,
    summary: `Reel in various fish, which can be sold.`,

    requiresUserinfo: true,
    cooldown: 60000
}