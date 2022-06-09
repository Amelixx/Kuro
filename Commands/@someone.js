const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage) => {
    return await message.channel.send(`(∩｀-´)⊃━☆ﾟ.*・｡ﾟ < ${message.guild.members.cache.filter(x => !x.user.bot).random()} >`)
}

module.exports.info = {
    name: `dsegdergreghwertgre`,
    type: "fun",
    noHelp: true,
    cooldown: 300000,
    requiresUserinfo: true
}