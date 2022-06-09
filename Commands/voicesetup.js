const Discord = require(`discord.js`),
fs = require(`fs`),
modules = require(`../modules.js`),
guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let info = guildinfo[message.guild.id], desc = `Temporary voice/text channels are an efficient way of allowing your members a lot of freedom over voice and (optionally) text channels by giving them permissions to edit a temporary channel that will be deleted when not in use. You may want to use this for a large server that can't keep making new voice channels for everyone, for example.\n\n`, category = ``

    if (info.temporary_voice && info.temporary_voice.category) {
        c = bot.channels.cache.get(info.temporary_voice.category);
        category = `(${c.name})`
        desc += `✔️ Temporary voice channels are setup in category ${c.name}.`}
    else desc += `❌ Temporary voice channels are not setup in this server.`

    let voice_inactivity, text = `(❌ Not Enabled)`, // text_inactivity = 
    if (info.temporary_voice) {
        if (info.temporary_voice.voice_inactivity) { /* voice_inactivity = */ }
    }

    let menuOptions = [
        `Assign a category for temporary voice channels ${category}`,
        `Edit time of inactivity before voice/text channel deletion (default: 5 seconds)`,
        `Enable/Disable text channels`
        `Edit max amount of channels I can create`
    ]
}

module.exports.info = {
    name: `voicesetup`,
    ignoreDM: true,
    type: `config`,
    summary: `Setup temporary voice/text channels for your members!`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_CHANNELS`],
    botPermissions: [`MANAGE_CHANNELS`]
};