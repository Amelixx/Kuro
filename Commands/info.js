const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.channel.type != `dm`) message.react(`📬`)

    let embed = new Discord.MessageEmbed()
    .setColor(`BLUE`)
    .setTitle(`ℹ️ Infomation`)
    .setDescription(
`Hi ${message.author.username}! I'm ${bot.user.username}, just a general purpose fun bot ^-^
My developer: **${bot.users.cache.get(`97238312355364864`).tag}**
Message my developer for more infomation on future updates.

__Features__
**Fun commands**, including commands that can link guilds together, buy roles in a server with bot money, and more.
**Administrative commands**, such as timed mutes, bans, etc.
**Bot Ecomony**.
**Auto Roles for both members and bots!**
Coming soon, **A level system!**
Use ${prefix}help for a full list of commands.

__Links__
:link: [Official Discord Server](https://discord.gg/bAqyGbZ)

👍 **If you like this bot, consider [upvoting Kuro](https://discordbots.org/bot/386868728098324481/vote) on Discord Bot List!**

☎️ If you like the **>call** command, you might be interested in joining the official discord server above and politely asking Grzesiek#4802 to make Communications Hub a thing again.`)

message.author.send({embed})

}

module.exports.info = {
    name: `info`,
    type: `info`,
    summary: `Displays various infomation about Kuro, as well as a server invite to Kuro's official server.`
}