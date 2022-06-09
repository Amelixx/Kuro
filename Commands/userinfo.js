const Discord = require(`discord.js`);

const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let member = await modules.fetchMember(message.guild, coreMessage)

    if (!member) member = message.member

    let hasAdmin = `False`
    if (member.hasPermission(`ADMINISTRATOR`, false, true)) hasAdmin = `True`
    roleList = listRoles(member)

    highestRole = member.roles.highest.name
    if (highestRole == `@everyone`) highestRole = String(`No roles.`)

    console.log(`RoleList: ${roleList}  highest: ${highestRole}`)

    let embed = new Discord.MessageEmbed()
    .setColor('BLACK') 
    .setAuthor(`Userinfo for ${member.user.username}`)
    .setThumbnail(member.user.displayAvatarURL)
    .addField(`Full Username`, member.user.tag,true)
    .addField(`UserID`, member.user.id,true)
    .addField(`Joined Discord`, member.user.createdAt.toDateString(), true)
    .addField(`Joined Server`, member.joinedAt.toDateString(),true)
    .addField(`Highest Role`, highestRole,true)
    .addField(`Administrator`, hasAdmin,true)
    .addField(`Roles`, roleList)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    message.channel.send({embed})
}

module.exports.info = {
    name: `userinfo`,
    ignoreDM: true,
    type: `info`,
    summary: `Displays infomation on a particular user.`
};

function listRoles(member) {
    //Lists the roles of a given member, returning an array, then removes everyone.
    let roleList = []
    count = 0

    member.roles.cache.forEach(async (role, id) => {
        if (role.name == `@everyone`) return;
        else if (count == 0) roleList = role
        else roleList += ` ${role}`
        count ++
    })

    if (count == 0) roleList = `No roles.`

    return roleList
}