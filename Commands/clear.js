const Discord = require(`discord.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.author.id != `97238312355364864` && !message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You don't have permission to run this command!\nMissing Permissions: \`MANAGE_MESSAGES\``)
    if (message.author.id != `97238312355364864` && !message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`I don't have permission to run this command!\nMissing Permissions: \`MANAGE_MESSAGES\``)
    message.channel.bulkDelete(coreMessage)
      .then(messages => message.channel.send(`Deleted ${messages.size} messages.`))
      .catch(console.error);
}

module.exports.info = {
    name: `clear`,
    type: `admin`,
    summary: `Clears a given amount of text.`
}
