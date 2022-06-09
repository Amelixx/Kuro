const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (args[1] == `server` || message.author == bot.user) inviteMessageLocation = message.channel  

    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setDescription(`You can invite me to any discord server by following this link!\n[Invite Kuro](https://discord.com/oauth2/authorize?client_id=670779750934904846&permissions=8&scope=bot)`)
    return message.channel.send({embed})  
}

module.exports.info = { 
    name: `invite`,
    type: `info`,
    summary: `Provides an OAuth2 invite link for Kuro.`
}