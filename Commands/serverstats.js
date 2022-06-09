const Discord = require(`discord.js`)

const serverstats = require(`../JSON/Stats/serverStats.json`)

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (coreMessage) guild = modules.fetchGuild(coreMessage)
    else guild = message.guild, 
    commandArray = [],
    commandUsageArray = []

    if (serverstats[guild.id] && serverstats[guild.id][`Command Usage`]) {
        commandsUsed = serverstats[guild.id][`Command Usage`][`Total Commands`].total
        

        for (x in serverstats[guild.id][`Command Usage`][`Total Commands`]) {
            if (x == `total`) continue
            commandUsageArray.push(serverstats[guild.id][`Command Usage`][`Total Commands`][x])
            commandArray.push(x)
        }
        favouriteCommandUsage = await modules.maxInArray(commandUsageArray)
        favouriteCommand = commandArray[commandUsageArray.indexOf(favouriteCommandUsage)]

    }
    else commandsUsed = `No commands used :(`



    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setThumbnail(guild.iconURL)
        .setTitle(`Server statistics for ${guild.name}`)
        .addField(`‼️ Commands used`, commandsUsed)
        .addField(`⭐ Favourite Command`, `${favouriteCommand} - used **${favouriteCommandUsage}** times!`)

    message.channel.send({embed})
}

module.exports.info = {
    name: `serverstats`,
    type: `info`,
    summary: `Displays Kuro statistics for a server.`,
    ignoreDM: true,
}