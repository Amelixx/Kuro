const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`Links`)
        .setDescription(`[Invite To Server](https://discordapp.com/oauth2/authorize?client_id=386868728098324481&permissions=8&scope=bot)\n`+
                        `[Upvote Kuro](https://discordbots.org/bot/386868728098324481/vote)\n`+
                        `[Discord Bot List Profile](https://discordbots.org/bot/386868728098324481)\n`+
                        `[Official Discord Server](https://discord.gg/bAqyGbZ)\n`)
    message.channel.send({embed})    

}

module.exports.info = {
    name: `links`,
    type: `info`,
    summary: `Displays various links based on Kuro (invite, upvote, etc)`,
    aliases: [`invite`, `upvote`]
}