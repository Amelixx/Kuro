const Discord = require("discord.js");

const modules = require(`../modules.js`)

const userStats = require(`../JSON/Stats/userStats.json`)
const serverStats = require(`../JSON/Stats/serverStats.json`)

const userinfo = require(`../JSON/userinfo.json`),
achievements = require(`../achievements.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) user = message.author
    else {
        let member = await modules.fetchMember(message.guild, coreMessage)
        if (!member) user = await modules.fetchUser(coreMessage)
        else user = member.user
    }
    if (!user || !coreMessage) user = message.author

    marriedTo = userinfo[user.id].marriagePartner
    if (marriedTo) partner = bot.users.cache.get(marriedTo) || await bot.users.fetch(marriedTo)
    else partner = `No one :frowning:`

    if (user.bot) return message.channel.send(`Bots can't have profiles.`)

    let serverCommands = new Number()
    if (userStats[user.id]) globalCommands = userStats[user.id][`Command Usage`].total
    else globalCommands = 0
    if (message.guild.member(user) && serverStats[message.guild.id][`Command Usage`][user.id]) serverCommands = serverStats[message.guild.id][`Command Usage`][user.id].total
    else serverCommands = 0

    let status = new String(" ")
    if (user.id == `97238312355364864`) {partner = `don't need anyone 😔`; status = `【My Developer!】\nHiya!\nI'm Rubix ^^\nI used to spend a lot of my time developing discord bots like this one, now I'm mostly just depressed about many many things - but, perhaps that will change in future`}
    //if (user.id == `756987238868320347`) {partner = `Wubixie 🥺`; status = `【Special Developer's Gurlfwend】\nKuro says this person is great`}

    let inventory = modules.getInventory(user),
    achievementString = "No achievements.. yet!"

    if (userinfo[user.id].achievements) {
        let achievementCount = userinfo[user.id].achievements.length
        achievementString = `${modules.progressBar(achievementCount, Object.keys(achievements).length, 20)}\n**${achievementCount}/${Object.keys(achievements).length} Achievements unlocked!**\n\n`
        for (let x in userinfo[user.id].achievements.slice(0,5)) {
            let name = userinfo[user.id].achievements[x],
            emoji = ""
            if (achievements[name] && achievements[name].emoji) emoji = `${achievements[name].emoji} `
            achievementString += `\`${emoji}${name}\`\n*${achievements[name].description}*\n\n`
        }
        if (achievementCount > 5) achievementString += `**...and ${achievementCount - 5} more (${prefix}achievements ${user.username})**`
    }
 
    if (message.guild && message.guild.member(user)) name = message.guild.member(user).displayName
    else name = user.username
    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`${name}'s Profile`)
        .setDescription(`${status}`)
        .setThumbnail(user.displayAvatarURL)
        .addField(`:credit_card: Balance`, `$${(userinfo[user.id].money || 0).toLocaleString()}`, true)
        .addField(`:heart: Married To`, partner, true)
        .addField(`:briefcase: Inventory`, inventory)
        .addField(`🏆 Achievements`, achievementString)
        .addField(`:bangbang: Commands Used (Global)`, globalCommands.toLocaleString(), true)
        if (message.guild && await message.guild.members.fetch(user) || user.id == `296750415964274689`) embed.addField(`:bangbang: Commands Used (Server)`, serverCommands.toLocaleString(), true)
    message.channel.send({embed})
}

module.exports.info = {
    name: `profile`,
    type: `info`,
    summary: `Displays the profile of a specific user, this displays infomation based on features within Kuro.`,

    requiresUserinfo: true
}