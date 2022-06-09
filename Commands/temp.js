const Discord = require(`discord.js`);
const fs = require(`fs`)
const settings = require(`../JSON/settings.json`)

const main = require(`../Kuro.js`)

const chalk = require(`chalk`)

const snekfetch = require(`snekfetch`)

const OtakuColorRoles = require(`../JSON/Storage/OtakuColorRoles.json`)

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`)
const guildinfo = require(`../JSON/guildinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let notfound = 0;
    for (let id in userinfo) {
        let user = bot.users.cache.get(id)
        if (!user) notfound ++
        else if (user.bot) {
            userinfo[id].bot = true
            console.log(id)
        }
    }
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    message.channel.send(notfound)
}

module.exports.info = {
    name: `temp`
}

async function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}