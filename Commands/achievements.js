const Discord = require(`discord.js`);

const modules = require(`../modules.js`),
achievements = require(`../achievements.js`),
userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, content) => {
    let user;
    if (!content) user = message.author
    else {
        if (message.guild) member = modules.getMember(message.guild, content, message.channel)
        else user = modules.getUser(content, message.channel)
        if (user == undefined && member == undefined) return;
        else if (member != undefined) user = member.user
        if (!user) return;
    }

    if (user.bot) {message.channel.send("Bots don't have achievements."); return false;}

    let arr = Object.keys(achievements),
    start = 0, amount = 10,
    timeout = false,
    msg, endingStart,
    pageCount = Math.ceil(arr.length / amount),
    userinfoKeys = Object.keys(userinfo)

    if (arr.length % 5 == 0) endingStart = arr.length - amount
    else endingStart = Math.floor(arr.length / amount) * amount

    while (!timeout) {
        let end = start+amount, leftArrow, rightArrow,
        activeAchievements = arr.slice(start, end),
        pageNumber = start / amount + 1,

        embed = new Discord.MessageEmbed()
        .setColor(`F7E2C5`)
        .setAuthor(`Kuro Achievements - Page ${pageNumber}/${pageCount}`)
        .setDescription(`All achievements are marked in four levels of rarity:\n\\🥉 -> **Easy**, grants $1000.\n\\🥈 -> **Medium**, grants $3000\n\\🥇 -> **Hard**, grants $6000\n\\🏵️ -> **Very Hard**, grants $12,000.\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)

        

        for (let i in activeAchievements) {
            let name = activeAchievements[i],
            rarities = {
                "Bronze": "🥉",
                "Silver": "🥈",
                "Gold": "🥇",
                "Platinum": "🏵️"
            },
            achievement = achievements[name], tick = "", progress = ""
            if (userinfo[user.id].achievements && userinfo[user.id].achievements.includes(name)) tick = "<:tickYes:741941155385835562> "
            if (achievement.progress && (!userinfo[user.id].achievements || !userinfo[user.id].achievements.includes(name))) {
                let current = achievement.progress(user)
                progress = `\n${modules.progressBar(current, achievement.goal, 25)}\n${current}/${achievement.goal}`
            }

            if (!achievement.dontShow) embed.addField(`${tick}\\${rarities[achievement.rarity]} ${name} (${userinfoKeys.filter(x => userinfo[x].achievements && userinfo[x].achievements.includes(name)).length} users)`, `*${achievement.description}*${progress}`)
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
    return true;
}

module.exports.info = {
    name: `achievements`,
    type: `info`,
    summary: `Displays a list of the achievements a user can obtain, and their progress towards them.`
}