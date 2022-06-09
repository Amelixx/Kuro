const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    guild = await modules.fetchGuild(coreMessage)
    if (coreMessage.toLowerCase() == `omniverse`) {guild = bot.guilds.cache.get(`451799907817488406`)}
    if (!guild) return message.channel.send(`Couldn't find a guild to add you to, Rubix.`)

    if (coreMessage.toLowerCase() == `omniverse`) code = `AFN56Cn`
    else {
        let invite = await modules.findInvite(guild)
        if (invite) code = invite.code
    }
    if (!code) return message.channel.send(`I couldn't find an invite to that guild :(`)
    else message.channel.send(`I found an invite :D\nhttps://discord.gg/${code}`)


}

module.exports.info = {
    name: `inviteme`,
    developer: true
}