const Discord = require(`discord.js`),
fs = require(`fs`),
modules = require(`../modules.js`),
guildinfo = require(`../JSON/guildinfo.json`)
module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let info = guildinfo[message.guild.id], desc, enable;

    if (info.welcome && info.welcome.channels && info.welcome.channels.includes(message.channel.id)) desc = `✔️ Messages are enabled on "${message.channel.name}"\n\n`, enable = "Disable"
    else desc = `❌ Messages are disabled on "${message.channel.name}"\n\n`, enable = "Enable"

    let menuOptions = [
        `Enable/Disable welcome messages for a specific channel`,
        `${enable} welcome messages in this channel ('${message.channel.name}')`,
        `Set the welcome message for members`,
        `Set the welcome message for bots`,
        `View welcome message and channels that I am sending welcome messages in`
    ],

    answer = await modules.sendMenu(message.author, message.channel, {title: `Welcome Config`, description: desc}, menuOptions)
    if (!answer) return;

    if (!info.welcome) guildinfo[message.guild.id].welcome = {} 
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))

    if (message.deletable) message.delete()
    if (answer.deletable) answer.delete()

    switch (answer.content) {
        case "1":
            answer = await modules.sendQuestion(message.author, message.channel, `Alright! Please specify the channel to enable welcome messages in. This can be a channel mention, the start of its name, or the channel ID.\nExamples for a channel named "example":\n\`#example\`\n\`exa\`\n\`677472086784081930\`\n\nIf I don't respond to your input, I can't find a channel from your message; please try again.`, m => {return modules.fetchChannel(m.content, m.guild, true).name != undefined})
            if (!answer) return;

            const channel = modules.fetchChannel(answer.content, message.guild, true)
            if (answer.deletable) answer.delete()
            if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return message.channel.send(`I don't have permission to send messages in that channel!`)

            enabled_or_disabled = enable_or_disable(channel)
            return message.channel.send(`**${enabled_or_disabled}** welcome messages on ${channel}. To undo this, run the command again with the same options.\n(Your options were "1", "${answer.content}")`)

        case "2":
            enabled_or_disabled = enable_or_disable(message.channel)
            return message.channel.send(`**${enabled_or_disabled}** welcome messages in this channel. To undo this, run the command again with the same options.\n(Your options were "2", "${answer.content}")`)
 
        case "3": case "4":
            let welcomeVariables = ""
            for (let x in modules.welcomeVariables) {
                welcomeVariables += `\`${x}\` -> ${modules.welcomeVariables[x]}\n`
            }

            members_or_bots = "bots"
            if (answer.content == "3") members_or_bots = "members" 
            userMsg = await modules.sendQuestion(message.author, message.channel, `Ok, **enter the message to be sent to ${members_or_bots} when they join.**\nThere are a few variables you can enter into this as many time as you like:\n\n${welcomeVariables}\nThis message times out in 5 minutes. If you need more time, ensure you have your desired message ready before running the command again.`, m => {return m.author == message.author}, 300000)
            if (!userMsg) return;

            if (userMsg.deletable) userMsg.delete()
            if (answer.content == "4") guildinfo[message.guild.id].welcome.newBotMessage = userMsg.content 
            else guildinfo[message.guild.id].welcome.newMemberMessage = userMsg.content
            fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))
            return message.channel.send(`✅Great! The welcome message for ${members_or_bots} has been set to the following (as it would be if you joined the server)\n-------------\n${modules.formatWelcomeMsg(userMsg.content, message.member)}\n-------------\nRunning this command again with the same options will overwrite this value.`)

        case "5":
            msg = "\`\`\`asciidoc\nWelcome Message Config\n======================\n\nChannels::\n"
            if (!info.welcome.channels || info.welcome.channels.length == 0) msg += `I am currently not sending welcome messages anywhere in this server. Set some channels using the first two menu options in ${prefix}welcome!`
            else {
                msg += `I am sending welcome messages in the following channels:\n. \n`
                info.welcome.channels.forEach(x => {msg += `#${message.guild.channels.cache.get(x).name} `})
            }
            msg += `\n\nMember Welcome Message::\n`
            if (!info.welcome.newMemberMessage) msg += `I am not sending welcome messages to new members. You can set one using option 3 of the ${prefix}welcome menu.`
            else msg += info.welcome.newMemberMessage

            msg += `\n\nBot Welcome Message::\n`
            if (!info.welcome.newBotMessage) msg += `I am not sending welcome messages to new bots. You can set one using option 4 of the ${prefix}welcome menu.`
            else msg += info.welcome.newBotMessage

            return message.channel.send(msg + `\`\`\``)
        
        default:
            return message.channel.send(`That isn't a valid menu option.`)
    }
}

enable_or_disable = (channel) => {
    let info = guildinfo[channel.guild.id], enabled
    if (info.welcome && info.welcome.channels && info.welcome.channels.includes(channel.id)) {
        guildinfo[channel.guild.id].welcome.channels.splice(info.welcome.channels.indexOf(channel.id), 1)
        enabled = "Disabled"
    }
    else {
        if (!info.welcome.channels) guildinfo[channel.guild.id].welcome.channels = [channel.id]
        else guildinfo[channel.guild.id].welcome.channels.push(channel.id)
        enabled = "Enabled"
    }
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))
    return enabled
}

module.exports.info = {
    name: `welcome`,
    ignoreDM: true,
    type: `config`,
    summary: `Set up welcome messages in your server!`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_ROLES`],
    botPermissions: [`MANAGE_ROLES`]
};