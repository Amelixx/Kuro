const Discord = require(`discord.js`);

const main = require(`../Kuro.js`)
const modules = require(`../modules.js`)

const globalStats = require(`../JSON/Stats/globalStats.json`)


module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let commandUsageArray = new Array(); let commandArray = new Array()
    for (x in globalStats[`Command Usage`]) {
        try {
        if (x == `total`) continue; 
        if (main.botCommands.get(x).info.developer) continue;
        commandUsageArray.push(globalStats[`Command Usage`][x])
        commandArray.push(x)
        } catch (e) {}
    }
    favouriteCommandUsage = await modules.maxInArray(commandUsageArray)
    favouriteCommand = commandArray[commandUsageArray.indexOf(favouriteCommandUsage)]

    let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    months = [`January`, `February`, "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    lastRestart = new Date(globalStats.botStarted),
    restartTime = lastRestart.toString().split(" ")[4],
    restartString = `${weekDays[lastRestart.getDay()]}, ${lastRestart.getDate()}${modules.suffix(lastRestart.getDate())} ${months[lastRestart.getMonth()]}, at ${restartTime} GMT+1`


    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`Global Statistics`)
        .addField(`Creator`, bot.users.cache.get(`97238312355364864`).tag, true)
        .addField(`Servers`, (bot.guilds.cache.size).toLocaleString(), true)
        .addField(`Users`, bot.users.cache.size.toLocaleString(), true)
        .addField(`Channels`, bot.channels.cache.size.toLocaleString(), true)
        .addField(`Commands Used`, globalStats[`Command Usage`].total.toLocaleString(), true)
        .addField(`Most Used Command`, `${favouriteCommand.capitalize()} (${favouriteCommandUsage.toLocaleString()} uses)`, true)
        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)
        .addField("\u200B", "\u200B", true)

        .addField(`Lines of Code (Commands)`, globalStats.lineCount.commandFiles.toLocaleString(), true)
        .addField(`Lines of Code (Main bot)`, globalStats.lineCount.mainFiles.toLocaleString(), true)
        .addField(`Total Lines of Code`, globalStats.lineCount.total.toLocaleString(), true)
        .addField(`Last Restart`, `${restartString}\n\nOnline for ${await modules.getTimeString(Date.now() - globalStats.botStarted, true)}.`);

    message.channel.send({embed})
}

module.exports.info = {
    name: `stats`,
    type: `info`,
    summary: `Displays global statistics for Kuro.`
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}