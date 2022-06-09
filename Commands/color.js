const Discord = require(`discord.js`);

const modules = require(`../modules.js`),
guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let validGuilds = [
        `403633086476189709`,
        `416974570671570947`,
        `417282414822424576`,
        "280564817788403713",
        `396588731886206978`,
        "429005375799427077",
        "430023007977603082",
        "366204534567075840",
        "368874690619375616",
        "441970293016363038",
        "421807015052967937",
        "349351650223194112",
        "449926025569107978",
        "450828228295262239",
        "459368463190720533",
        "444673776961978371",
        `677471030238773259`,
        "689490191324414018",
        "689734320784408667",
        "714847904648658944"
    ]

    if (!validGuilds.includes(message.guild.id)) return console.log(`Colours not enabled on this server.`)

    if (isNaN(args[1]) || !args[1] || Number(args[1]) > 51 || Number(args[1]) < 0) return message.channel.send(`✖️ Enter a number between 1 and 51 for a color!`)
    
    await message.member.roles.cache.forEach(async (role, id) => { if (Number(role.name) < 52 && Number(role.name) > -1) { message.member.roles.remove(role) }})
    
    let role = (message.guild.roles.cache.find(x => x.name == args[1]))

    if (!role) return message.channel.send(`I couldn't find a role called ${args[1]} ;-;`)

    message.member.roles.add(message.guild.roles.cache.find(x => x.name == args[1]))
    message.channel.send(`Your color has been set to ${args[1]}!`)
}

module.exports.info = {
    name: `color`,
    aliases: [`colour`],
    noHelp: true
}