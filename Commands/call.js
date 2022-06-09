const Discord = require(`discord.js`);
const fs = require(`fs`);

const modules = require(`../Modules.js`)

const calls = require(`../JSON/calls.json`)
const guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) return message.channel.send(`Command usage: \`${prefix}call <channel/"random">\``)

    if (args[1].toLowerCase() == `accept`) {
        if (!calls[message.channel.id] || !calls[message.channel.id].beingCalled) return message.channel.send(`This channel isn't being called.`)
        let linkedChannel = bot.channels.cache.get(calls[message.channel.id].linkedChannel)

        if (guildinfo[linkedChannel.guild.id].prefix) serverPrefix = guildinfo[linkedChannel.guild.id].prefix
        else serverPrefix = `>`

        calls[message.channel.id].time = Date.now()
        calls[message.channel.id].beingCalled = false
        calls[linkedChannel.id].time = Date.now()
        calls[linkedChannel.id].calling = false

        await fs.writeFile(`./JSON/calls.json`, JSON.stringify(calls, null, 4), err => { if (err) throw err; });

        await message.channel.send(`Call answered! Say hi!\nType **${prefix}call end** to end the call.`)
        if (message.channel.guild == linkedChannel.guild) return linkedChannel.send(`${message.channel} answered the call! Say hi!\n Type **${prefix}call end** to end the call.`)
        else return linkedChannel.send(`**${message.guild.name}** answered the call! Say hi!\nCalling channel: **${message.channel.name}**\n Tpye **${serverPrefix}call end** to end the call.`)
        
    }
    else if (args[1].toLowerCase() == `deny`) {
        if (!calls[message.channel.id] || !calls[message.channel.id].beingCalled) return message.channel.send(`This channel isn't being called.`)
        let linkedChannel = bot.channels.cache.get(calls[message.channel.id].linkedChannel)

        message.channel.send(`Call denied.`)
        if (message.channel.guild == linkedChannel.guild) linkedChannel.send(`${message.channel} denied the call.`)
        else linkedChannel.send(`**${linkedChannel.guild.name}** denied the call.`)

        delete calls[linkedChannel.id]
        delete calls[message.channel.id]
        return await fs.writeFile(`./JSON/calls.json`, JSON.stringify(calls, null, 4), err => { if (err) throw err; });
    }
    else if (args[1].toLowerCase() == `end`) {
        if (!calls[message.channel.id]) return message.channel.send(`This channel isn't in a call!`)
        else if (calls[message.channel.id].beingCalled) return message.channel.send(`This channel is being called. Use **${prefix}call <accept/deny>** to respond.`)

        let linkedChannel = bot.channels.cache.get(calls[message.channel.id].linkedChannel)

        message.channel.send(`Call ended.`)
        if (message.channel.guild == linkedChannel.guild) linkedChannel.send(`${message.channel} terminated the call.`)
        else linkedChannel.send(`**${linkedChannel.guild.name}** terminataed the call.`)

        delete calls[linkedChannel.id]
        delete calls[message.channel.id]
        return await fs.writeFile(`./JSON/calls.json`, JSON.stringify(calls, null, 4), err => { if (err) throw err; });
    }
    else if (args[1].toLowerCase() == `random`) {

    }
    
    let channelToLink = message.mentions.channels.first() || bot.channels.cache.get(coreMessage)
    if (!channelToLink) channelToLink = await modules.fetchChannel(coreMessage, message.guild)

    if (!channelToLink) return message.channel.send(`Couldn't find a channel. Either there's more than one channel matching '${coreMessage}', or it doesn't exist.`)
    else if (channelToLink == message.channel) return message.channel.send(`You can't call your own channel!`)
    else if (channelToLink.type == `voice`) return message.channel.send(`I can't call voice channels!`)
    else if (calls[message.channel.id] && calls[message.channel.id].beingCalled) return  message.channel.send(`This channel is being called. Type **${prefix}call <accept/deny>** to answer.`)
    else if (calls[message.channel.id] && calls[message.channel.id].calling) return message.channel.send(`This channel is already calling another channel.`)
    else if (calls[message.channel.id]) return message.channel.send(`This channel is already in a call. Type **${prefix}call end** to end the call.`)
    else if (calls[channelToLink.id] && calls[channelToLink.id].beingCalled) return message.channel.send(`That channel is being called. Try again later.`)
    else if (calls[channelToLink.id] && message.guild == channelToLink.guild) return message.channel.send(`${channelToLink} is already in a call. Try again later.`)
    else if (calls[channelToLink.id]) return message.channel.send(`That channel is already in a call. Try again later.`)
    else if (!channelToLink.permissionsFor(channelToLink.guild.me).has(`SEND_MESSAGES`) || !channelToLink.permissionsFor(channelToLink.guild.me).has(`VIEW_CHANNEL`)) return message.channel.send(`I don't have permission to send messages in that channel!`)   


    if (guildinfo[channelToLink.guild.id].prefix) serverPrefix = guildinfo[channelToLink.guild.id].prefix
    else serverPrefix = `>`

    message.channel.send(`☎️ Waiting for ${channelToLink.guild.name} to answer phone...\nCalling channel: **${channelToLink.name}**`)
    if (message.guild == channelToLink.guild) msg = new Object(await channelToLink.send(`☎️ You are receiving a call from ${message.channel}! Type **${prefix}call <accept/deny>** to answer.\nHanging-up automatically in 40 seconds.`))
    else msg = new Object(await channelToLink.send(`☎️ You are receiving a call from another guild!. Type **${serverPrefix}call <accept/deny>** to answer.\nHanging-up automatically in 40 seconds.\n` + 
                            `Calling guild: **${message.guild.name}** | Channel: **${message.channel.name}**`))


    calls[message.channel.id] = {
        linkedChannel: channelToLink.id,
        calling: true
    }
    calls[channelToLink.id] = {
        linkedChannel: message.channel.id,
        beingCalled: true
    }

    await fs.writeFile(`./JSON/calls.json`, JSON.stringify(calls, null, 4), err => { if (err) throw err; });

    await delay(40)
    if (calls[channelToLink.id] && calls[channelToLink.id].beingCalled) {
        await msg.delete();
        await message.channel.send("☎️ Nobody picked up.")

        delete calls[message.channel.id]
        delete calls[channelToLink.id]
        await fs.writeFile(`./JSON/calls.json`, JSON.stringify(calls, null, 4), err => { if (err) throw err });
        if (channelToLink.guild == message.guild) channelToLink.send(`☎️ You missed a call from ${message.channel}. **${date}**`)
        else channelToLink.send(`☎️ You missed a call from **${message.guild.name}**. **${new Date().toTimeString()}**`)
    }
}

module.exports.info = {
    name: `call`,
    type: `fun`,
    ignoreDM: true,
    summary: `"calls" a specified channel (or a random one) by linking them using Kuro.`,

    requiresGuildinfo: true,

    help:
`To start a call for a specific channel, use **%PREFIX%call (channel mention or channel ID)**.
You can find a channel's ID by right clicking on it (if you have developer mode enabled) or by using **%PREFIX%channelinfo** in the channel.

Alternatively, use **%PREFIX%call random** to call a random server.
The other end has to accept the call before it is enabled.`
}

function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}