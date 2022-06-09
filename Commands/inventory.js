const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let user;
    if (!content) user = message.author
    else {
        if (message.guild) member = modules.getMember(message.guild, args[1], message.channel)
        else user = modules.getUser(args[1], message.channel)
        if (user == undefined && member == undefined) return;
        else if (member != undefined) user = member.user
    }

    if (message.channel.type == `dm` || !message.guild.member(user)) name = user.username; 
    else name = message.guild.member(user).displayName

    inventory = modules.getInventory(user)

    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setAuthor(`${name}'s Inventory`, user.displayAvatarURL)
        .setDescription(inventory)

        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    message.channel.send({embed})
}

module.exports.info = {
    name: `inventory`,
    type: `info`,
    summary: `Displays a specific user's inventory.`,
    aliases: [`inv`],

    requiresUserinfo: true
}