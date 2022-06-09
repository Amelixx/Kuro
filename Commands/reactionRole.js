const Discord = require(`discord.js`),
fs = require(`fs`),
modules = require(`../modules.js`),
guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let info = guildinfo[message.guild.id], desc

    if (info.reaction_roles) desc = `✔️ There are reaction roles enabled on this server.\n\n`
    else desc = `❌ Reaction roles have not been enabled on this server.\n\n`

    let menuOptions = [
        `Setup reaction roles in a specific channel`,
        `Setup reaction roles in this channel ("#${message.channel.name}")`,
        `Setup reaction roles on a pre-made message`
    ],

    answer = await modules.sendMenu(message.author, message.channel, {title: `Reaction Roles Config`, description: desc}, menuOptions)
    if (!answer) return;

    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))

    if (message.deletable) message.delete()
    if (answer.deletable) answer.delete()

    let channel, reactionMsg;
    if (answer.content == "1" || answer.content == "3") {
        if (answer.content == "1") s = `Ok, please specify the channel to enable reaction roles in.`
        else s = "Please specify the channel the message is in."
        answer3 = await modules.sendQuestion(message.author, message.channel, `**${s}** This can be a channel mention, the start of its name, or the channel ID.\nExamples for a channel named "example":\n\`#example\`\n\`exa\`\n\`677472086784081930\`\n\nIf I don't respond to your input, I can't find a channel from your message; you don't need to run the command again, just keep entering values until I find one that is acceptable.`, m => {return modules.fetchChannel(m.content, m.guild, true).name != undefined})
        if (!answer3) return;

        channel = modules.fetchChannel(answer3.content, message.guild, true)
        if (answer3.deletable) answer3.delete()
        if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return message.channel.send(`I don't have permission to send messages in that channel.`)

        if (answer.content == "3") {
            answer2 = await modules.sendQuestion(message.author, message.channel, `**Now enter a message ID in that channel.** You can find this by enabling developer mode in the "appearance" tab in settings, then right clicking a message and selecting "copy ID"\n\nIf I don't respond to your input, it's not a valid ID. You don't need to run the command again, just keep entering values until I find one that is acceptable.`, async m => {let msg = await channel.messages.fetch(m.content); return msg.content != undefined})
            if (!answer2) return;

            reactionMsg = await channel.messages.fetch(answer2.content)
            if (answer2.deletable) answer2.delete()
        }
    }
    else if (answer.content == "2") channel = message.channel
    else return message.channel.send(`That isn't a valid menu option.`)

    if (!reactionMsg) {
        // Get a category of roles (one message) -> String
        a = await modules.sendQuestion(message.author, message.channel, `**Reaction Role Setup - Step 1/4 - Category Name**\n\`\`\`Enter a name for the category. This will be a single message with a selection of roles and emojis.\`\`\``, (m) => true)
        if (!a) return;
        categoryName = a.content
    }

    // Get amount of roles -> Number
    a2 = await modules.sendQuestion(message.author, message.channel, `**Reaction Role Setup - Step 2/4 - Amount of Roles**\n\`\`\`Enter the amount of roles / emojis that will be on this category. (Maximum 20)\`\`\``, (m) => !isNaN(m.content) && 1 <= Number(m.content) <= 20)
    if (!a2) return;
    let roleCount = Number(a2.content),

    // Get the roles -> [RoleIDs. .]
    roles = [],
    string = `**Reaction Role Setup - Step 3/4 - Roles**\`\`\`Enter the roles in this category one at a time.\`\`\`I can detect roles in a number of ways, a role mention, the start of the name, or its ID. A role named "example" could be detected by the following:\n\n\`@example\`\n\`exa\`\n\nIf I don't respond to your input, I can't find a role from your message; you don't need to run the command again, just keep entering values until I find one that is acceptable.\n\n`,
    msg = await message.channel.send(string+`**Entering role ${roles.length + 1}/${roleCount}**`), roleString = ""
    while (roles.length < roleCount) {
        a3 = await message.channel.awaitMessages(m => (m.content.toLowerCase() == 'exit' || m.content.toLowerCase() == 'quit' || modules.fetchRole(m.content, m.guild, true).name != undefined) && m.author.id == m.author.id , {max: 1, time: 90000, errors: ['time']})
        .catch(c => {msg.delete(); message.channel.send(`⏰ Menu timed out due to inactivity.`).catch(e => {console.error(e)})})
        if (!a3) return;
        a3 = a3.first()
        if (['exit', 'quit'].includes(String(a3.content).toLowerCase())) return;

        role = modules.fetchRole(a3.content, a3.guild, true);
        roleString += `\`${role.name}\`  `
        roles.push(role.id)

        a3.delete()

        if (roles.length != roleCount) msg.edit(string+`**Current Roles** - ${roleString}\n**Entering role ${roles.length + 1}/${roleCount}**`)
    }

    // Get the reactions for those roles -> [EmojiNames. . .]
    string = `**Reaction Role Setup - Step 4/4 - Emojis**\`\`\`React to this message with the emojis users will react to in order to get the role shown below.\`\`\`\n`, emojis = [], emojisForReacting = []
    msg.edit(string+`React with the emote for role \`${message.guild.roles.cache.get(roles[0]).name}\``)
    while (emojis.length < roleCount) {
        reaction = await msg.awaitReactions((r, u) => u == message.author, {max: 1, time: 90000, errors: ['time']})
        .catch(e => {msg.delete(); message.channel.send(`⏰ Menu timed out due to inactivity.`)})
        if (!reaction) return;
        reaction = reaction.first()

        if (reaction.emoji.id) {
            emojis.push(reaction.emoji.name)
            emojisForReacting.push(reaction.emoji.id)
        }
        else {
            emojis.push(reaction.emoji.name)
            emojisForReacting.push(reaction.emoji.name)
        }

        if (emojis.length != roleCount) msg.edit(string+`React with the emote for role \`${message.guild.roles.cache.get(roles[emojis.length]).name}\``)
    }

    if (!reactionMsg) {
        // Send reaction message and react to it
        string = `**${categoryName}**\n\n`
        reactionMsg = await channel.send(string)
    }

    // Mix 'em all together into a beautiful data structure
    if (!guildinfo[message.guild.id].reaction_roles) guildinfo[message.guild.id].reaction_roles = {}
    if (!guildinfo[message.guild.id].reaction_roles[channel.id]) guildinfo[message.guild.id].reaction_roles[channel.id] = {}
    if (!guildinfo[message.guild.id].reaction_roles[channel.id][reactionMsg.id]) guildinfo[message.guild.id].reaction_roles[channel.id][reactionMsg.id] = {}
    for (let i in emojis) {
        let x = emojis[i], role = message.guild.roles.cache.get(roles[i])
        guildinfo[message.guild.id].reaction_roles[channel.id][reactionMsg.id][x] = roles[i]

        if (isNaN(emojisForReacting[i])) string += `${emojisForReacting[i]} - \`${role.name}\`\n`
        else {
            let emoji = message.guild.emojis.cache.get(emojisForReacting[i]),
            a = ""
            if (!emoji) return message.channel.send(`One of your emojis ("${emojis[i]}") is from a server I'm not in. I can't use this emoji. Either add me to the server you got it from or add it to this server and try again.`)
            if (emoji.animated) a = "a"
            string += `<:${emoji.name}:${emoji.id}> - \`${role.name}\`\n`
        }
        reactionMsg.react(emojisForReacting[i])
    }
    reactionMsg.edit(string)
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))

    if (reactionMsg) return await message.channel.send(`Reaction roles created on message in ${channel} on message ID \`${reactionMsg.id}\`. Run the command again to make more on another message.`)
    message.channel.send(`Reaction role category setup. Run the command again to make another category.`)
}

module.exports.info = {
    name: `reactionrole`,
    aliases: [`selfroles`, `reactionroles`],
    ignoreDM: true,
    type: `config`,
    summary: `Setup reaction roles in multiple channels of your choice!`,

    requiresGuildinfo: true,

    permissions: [`MANAGE_GUILD`]
};