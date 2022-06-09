const Discord = require(`discord.js`);
const fs = require(`fs`)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args) => {
    let oldhelp = userinfo[message.author.id].oldHelp
    if (oldhelp) {
        userinfo[message.author.id].oldHelp = false
        message.channel.send(`I'll send you the default help command from now on.\n**Try ${prefix}help!**`)
    }
    else {
        userinfo[message.author.id].oldHelp = true
        message.channel.send(`From now on, you'll be sent an older, simpler help command.\n\`You can change this at any time by running this command again.\`\n**Try ${prefix}help!**`)
    }
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.info = {
    name: `oldhelp`,
    aliases: [`newhelp`, `togglehelp`],
    type: `config`,
    summary: `Toggle whether you receive the classic help command or the newer one when you run this command.`,

    requiresUserinfo: true
}