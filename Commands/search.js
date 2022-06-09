const Discord = require("discord.js");
const fs = require(`fs`);

const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    const cooldowns = userinfo[message.author.id].cooldowns
    if (message.author.bot) return;
    let success = await modules.randomInt(0,10); if (success > 7) success = false; else success = true

    if (success) moneyToGive = Number(await modules.randomInt(10,150))
    else moneyToGive = 0

    let currentMoney = new Number(0);
    if (await userinfo[message.author.id].money) currentMoney = await userinfo[message.author.id].money
    if (!currentMoney) userMoney = moneyToGive
    else userMoney = Number(currentMoney) + Number(moneyToGive)

    let successMessages = new Array (
        `:tada: You find $${moneyToGive} in a bin. I guess someone didn't want it...`,
        `:tada: You find $${moneyToGive} on the floor.`,
        `:tada: A bag of money flies past you for no apparent reason. You receive $${moneyToGive} from it.`,
        `:tada: You find $${moneyToGive}.`,
        `:tada: You find $${moneyToGive} in a pile of garbage. How desperate.`,
        `:tada: You manage to find a wallet. It contains $${moneyToGive}.`
    )
    let failureMessages = new Array (
        `You find nothing but dust.`,
        `You got bored of searching for money and went home. Shame on you.`,
        `You found $${modules.randomInt(10,150)} on the floor, but someone else took it.`,
        `You found $${modules.randomInt(1000,2000)}! However, you accidentally dropped it into a gutter.`,
        `You found a wallet, but there's nothing in it.`
    )

    userinfo[message.author.id].money = userMoney

    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))

    if (success) {
        return await message.channel.send(successMessages[modules.randomInt(0, successMessages.length - 1)])
    }
    else {
        await message.channel.send(failureMessages[modules.randomInt(0, failureMessages.length - 1)])
        return false
    }
}

module.exports.info = {
    name: `search`,
    type: `money`,
    summary: `Allows the user to get a random amount of money, or occasionally find a rare item.`,

    requiresUserinfo: true,
    cooldown: 60000
}