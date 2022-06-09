const Discord = require(`discord.js`)
const fs = require(`fs`);
const chalk = require(`chalk`)

let guildinfo = require(`../JSON/guildInfo.json`)
let userinfo = require(`../JSON/userinfo.json`)
let settings = require(`../JSON/settings.json`),
config = settings

const modules = require(`../modules.js`)
const main = require(`../Kuro.js`)

const serverStats = require(`../JSON/Stats/serverStats`)

Pet = require(`../Pet.js`),

http = require(`http`),
kuroAPI = require(`../kuroAPI.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    try {
        evaluation = await eval(coreMessage);
    }
    catch(err) {
        evaluation = `There was an error during evaluation!\n${err}`
        console.log(err)
    }

    let embed = new Discord.MessageEmbed()
        .setColor(`BLACK`)
        .setTitle(`<a:loading:504323385824641045> Eval <a:loading:504323385824641045>`)
        .addField(`Code`,`\`\`\`js\n${coreMessage} \`\`\``)
        .addField(`Result`, `\`\`\`\n${evaluation} \`\`\``)
    message.channel.send({embed})
    return true
}

module.exports.info = {
    name: `eval`,
    developer: true
}