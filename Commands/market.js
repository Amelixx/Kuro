const Discord = require(`discord.js`);
const fs = require(`fs`)

const modules = require(`../modules.js`)

const userinfo = require(`../JSON/userinfo.json`)
const items = require(`../JSON/items.json`),
main = require(`../Kuro.js`),

dbl = main.dbl

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!args[1]) {
        let startingDesc = `To buy an item, use **${prefix}market buy (item)**.\nTo sell, use **${prefix}market sell (item)**\nTo sell all items that have no other use, use **${prefix}market sellall**\nItems sell at half the buy value.\n\nYou have **$${(userinfo[message.author.id].money || 0).toLocaleString()}.**`,
        embed = new Discord.MessageEmbed()
            .setColor([10, 100, 200])
            .setAuthor(`${bot.user.username}'s Market`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL),
        arr = Object.keys(items).filter(x => items[x].price),
        start = 0, amount = 8,
        timeout = false,
        msg, endingStart,
        pageCount = Math.ceil(arr.length / amount),
        content = coreMessage

        if (arr.length % 5 == 0) endingStart = arr.length - amount
        else endingStart = Math.floor(arr.length / amount) * amount

        if (content && !isNaN(content) && content >= 1 && content <= pageCount) start = (Math.round(content) * amount) - amount
        else if (content.toLowerCase() == "end") start = endingStart

        while (!timeout) {
            let end = start+amount, leftArrow, rightArrow,
            pageItems = arr.slice(start, end),
            pageNumber = start / amount + 1,
            desc = startingDesc

            for (let item in pageItems) { 
                item = pageItems[item]
                let i = items[item];
                desc += `\n\n${i.emoji} \`${item}\`\n**$${i.price.toLocaleString()}**\n*${i.description}*`
            }
            desc += `\n\nPage ${pageNumber}/${pageCount}`
            embed.setDescription(desc)

            if (!msg) {
                msg = await message.channel.send({embed})
                farLeftArrow = await msg.react(`⏮`)
                leftArrow = await msg.react("⬅")
                rightArrow = await msg.react("➡")
                farRightArrow = await msg.react(`⏭`)
            }
            else msg = await msg.edit({embed})

            // Remove all user's reactions
            let reactions = msg.reactions.cache.filter(x => x.users.cache.get(message.author.id))
            if (reactions) reactions.forEach(x => {x.users.remove(message.author)})

            let filter = (r, u) => u == message.author && ((pageNumber != 1 && ["⏮", "⬅"].includes(r.emoji.name)) || (pageNumber != pageCount && ["⏭","➡"].includes(r.emoji.name))),
            reaction = await msg.awaitReactions(filter, {errors: ['time'], max: 1, time: 300000})
            .catch((e) => {
                if (farLeftArrow) farLeftArrow.remove()
                if (leftArrow) leftArrow.remove()
                if (rightArrow) rightArrow.remove()
                if (farRightArrow) farRightArrow.remove()
                timeout = true
            })
            if (!timeout) {
                reaction = reaction.first()
                reaction.users.remove(message.author)
                if (reaction.emoji.name == "⬅") start -= amount
                else if (reaction.emoji.name == "➡") start += amount
                else if (reaction.emoji.name == `⏮`) start = 0
                else if (reaction.emoji.name == `⏭`) start = endingStart
            }
        }
    }
    else if (args[1].toLowerCase() == "sellall" || coreMessage.toLowerCase() == "sell all") {
        let inventory = userinfo[message.author.id].inventory, msg = "", money = 0

        for (let item in inventory) {
            if (items[item].sell) {
            amount = items[item].sell * inventory[item]
                msg += `Sold ${inventory[item]} x ${items[item].emoji} for $${amount.toLocaleString()}.\n`
                money += amount
                modules.removeFromInventory(message.author, item, inventory[item])
            }
        }
        if (!msg) msg = `No items to sell.`
        else {
            msg += `\nSubtotal: $${money.toLocaleString()}.`
            modules.addMoney(message.author, money)
        }
        return await message.channel.send(msg)
    }
    else if (args[1].toLowerCase() == `buy`) {
        let amount = new Number(1); let arg = args[1]
        if (await !isNaN(args[2])) { arg = `${args[1]} ${args[2]}`; amount = args[2] }

        let item = await modules.getMarketItem(coreMessage.replace(`${arg} `, ``))

        if (!item) return await message.channel.send(`:x: Invalid item. either there was more than one item found, or the item doesn't exist.`)
        
        if (item == "Crystal Ball" && !await dbl.hasVoted(message.author.id)) return message.channel.send(`You need to vote for Kuro on Discord Bot List to buy this item. Voting is free and helps the developer! You can vote here:\nhttps://top.gg/bot/386868728098324481/vote`)

        let connective = String(`a`); let s = new String()
        if (modules.vowels.includes(item[0].toLowerCase())) connective = `an`
        if (amount > 1) { connective = amount; s = `s`}

        if (Number(items[item].price) * amount > userinfo[message.author.id].money) return message.channel.send(`You don't have enough money to buy ${connective} ${item}${s}!`)

        if (String(amount).startsWith(`0`) || amount < 1) return message.channel.send(`✖️Invalid amount.`)

        modules.addToInventory(message.author, item, amount)

        userinfo[message.author.id].money -= Number(items[item].price) * amount
        await message.channel.send(`Successfully bought ${connective} ${item}${s} for $${Number(items[item].price) * amount}! ${items[item].emoji}`)
        console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    }
    else if (args[1].toLowerCase() == `sell`) {
        let amount = new Number(1); let arg = args[1]; let arg2 = args[2]; let item = new String()
        if (await !isNaN(args[2])) { arg = `${args[1]} ${args[2]}`; amount = args[2]; arg2 = args[3]}

        if (!arg2) return message.channel.send(`Enter an item to sell!`)

        if (arg2.toLowerCase() == `fish`) item = `Fish`
        else if (arg2.toLowerCase() == "gold") item = "Gold"
        else item = Object.keys(items).find(x => {return x.toLowerCase().startsWith(arg2.toLowerCase())})

        if (!item) return await message.channel.send(`:x: Invalid item. either there was more than one item found, or the item doesn't exist.`)

        let connective = String(`a`); let s = new String()
        if (modules.vowels.includes(item[0].toLowerCase())) connective = `an`
        if (amount > 1) { connective = amount; s = String(`s`)}
        if (item.toLowerCase().includes(`fish`) && amount > 1) s = String()

        if (!userinfo[message.author.id].inventory[item]) return message.channel.send(`You don't have ${connective} ${item}${s} to sell! ${items[item].emoji}`)
        else if (userinfo[message.author.id].inventory[item] < amount) return message.channel.send(`You don't have enough ${item}s to sell! ${items[item].emoji}`)

        if (String(amount).startsWith(`0`) || amount < 1) return message.channel.send(`✖️Invalid amount.`)

        await modules.removeFromInventory(message.author, item, amount)

        if (items[item].price) moneyToAdd = new Number((items[item].price / 2) * amount)
        else moneyToAdd = new Number(items[item].sell * amount)

        await modules.addMoney(message.author, moneyToAdd)
        
        console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
        return message.channel.send(`Successfully sold ${connective} ${item}${s} for **$${moneyToAdd.toLocaleString()}**! ${items[item].emoji}`)
    }
}

module.exports.info = {
    name: `market`,
    type: `money`,
    summary: `Displays Kuro's market.`,
    subCommands: [`buy`, `sell`],
    aliases: [`shop`],

    requiresUserinfo: true
}