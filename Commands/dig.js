const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`),
items = require(`../JSON/items.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!userinfo[message.author.id].inventory[`Pickaxe`]) {message.channel.send(`Are you trying to dig with your bare hands? You need a pickaxe for that!`); return false}

    let success = modules.randomInt(0,10) < 9, item;

    num = modules.randomInt(0,100);
    if (num < 30) item = "Coal"
    else if (num < 54) item = "Iron"
    else if (num < 74) item = "Silver"
    else if (num < 81) item = "Sapphire"
    else if (num < 88) item = "Ruby"
    else if (num < 95) item = "Emerald"
    else if (num <= 99) item = "Gold"
    else item = "Diamond"

    let failureMessages = await new Array(
        `You found nothing but stone.`,
        `Just rubble.`,
        `Just a piece of rock.`,
        `Someone else must have got the valuables.. you find stone.`,
        `You found something! It's.. grey! It's stone.`
    )

    if (success) {
        modules.addToInventory(message.author, item, 1)
        if (["Gold","Diamond"].includes(item)) msg = `:pick: **Ultra Rare!** You you managed to find ${items[item].prefix} **${item}**! ${items[item].emoji}:tada:`
        else msg = `:pick: You dug up ${items[item].prefix} ${item}! ${items[item].emoji}`
        if (item == "Diamond")  {
            let embed = modules.addAchievements(message.author, ["Ooo, shiny!"])
            if (embed) message.channel.send({embed})
        }
        return await message.channel.send(msg)
    }
    else {
        modules.addToInventory(message.author, "Stone", 1)
        return await message.channel.send(`:pick:` + failureMessages[modules.randomInt(0, failureMessages.length - 1)] + ` <:stone:715971200274268161>`)
    }
}

module.exports.info = {
    name: `dig`,
    type: `money`,
    summary: `Dig a hole, what might you uncover?`,

    requiresUserinfo: true,
    cooldown: 120000
}