const Discord = require(`discord.js`),

userinfo = require(`../JSON/userinfo.json`),
modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let arr = modules.getLeaderboardArray();
    let start = 0, amount = 10,
    timeout = false,
    msg, endingStart,
    pageCount = Math.ceil(arr.length / amount),
    total = Object.keys(userinfo).reduce((a,b) => {return a + userinfo[b].money}, 0)

    if (arr.length % 5 == 0) endingStart = arr.length - amount
    else endingStart = Math.floor(arr.length / amount) * amount

    if (content && !isNaN(content) && content >= 1 && content <= pageCount) start = (Math.round(content) * amount) - amount
    else if (content.toLowerCase() == "end") start = endingStart

    while (!timeout) {
        let end = start+amount, leftArrow, rightArrow,
        users = arr.slice(start, end),
        pageNumber = start / amount + 1,

        embed = new Discord.MessageEmbed()
        .setColor(`F7E2C5`)
        .setAuthor(`Economy Leaderboard - Page ${pageNumber}/${pageCount}`, `https://cdn.discordapp.com/icons/538361750651797504/b9950a2556dfa394b1812ccfb556096b.jpg`)
        .setDescription(`Total: $${total}`)
        .setFooter(`You can get a certain page number using ${prefix}lb <number>`)

        for (let i in users) {
            let user = bot.users.cache.get(users[i]) || await bot.users.fetch(users[i])
            embed.addField(`[${Number(arr.indexOf(users[i]))+1}] ${user.tag}`, `$${userinfo[users[i]].money.toLocaleString()}`)
        }

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

module.exports.info = {
    name: `leaderboard`,
    type: `money`,
    summary: `View the richest people on Kuro.. or the poorest.`,
    aliases: [`top`, `lb`]
}