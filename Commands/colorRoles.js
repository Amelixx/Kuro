const Discord = require(`discord.js`)
const fs = require(`fs`);

const colorRoles = require(`../JSON/Storage/colorRoles.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let description = new String()
    
    count = 0
    for (let role in colorRoles) {

        role = colorRoles[role]

        guildRole = await message.guild.roles.cache.find(r => r.name == role.name)

        if (!guildRole) continue
        if (count < 5) {description += `${guildRole}  `}
        else {description += `${guildRole}\n`; count = 0}
        count ++
    }
    
    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`Colour Roles List`)
        .setDescription(description)
    message.channel.send({embed})
}

module.exports.info = {
    name: `colorroles`,
    type: `info`,
    summary: `Displays all of the colour roles, and their appropiate colour. For reference.`
}