const Discord = require(`discord.js`)
const modules = require(`../modules.js`)

const main = require(`../Kuro.js`),
userinfo = require(`../JSON/userinfo.json`)

module.exports = {
    run: async (bot, message, args, content, prefix) => {
        if (userinfo[message.author.id] && userinfo[message.author.id].oldHelp) return main.commands.get("help_old").run(bot, message, args, content, prefix)

        let embed = new Discord.MessageEmbed(),

        // categories and stuff
        categories = {
            info: {
                displayName: " Information",
                emote: `ℹ️`,
                summary: `Links, stats`,
                desc: `Information commands provide general data about the bot, such as statistics, links, this help command as well as other useful stuff.`
            },
            money: {
                displayName: `Economy`,
                emote: `💰`,
                summary: `Kuro monies!`,
                desc: "Don't forget you can DM Kuro to post suggestions (they are monitored!)."
            },
            fun: {
                emote: `🕹️`,
                summary: `Games, 8ball, etc`,
                desc: "These are mostly a waste of time, but if you'd like to suggest they be integrated into the economy some way so they have a purpose, please don't hesitate to DM Kuro with suggestions (they are monitored)!"
            },
            config: {
                displayName: "Configuration",
                emote: "⚙️",
                summary: "Autorole, prefix",
                desc: "Server configuration."
            },
            admin: {
                emote: `🔰`,
                summary: `Staff Commands`,
                desc: `Server Mods, this one is for you.`
            }
        },
        msg = ``
        embed.setColor(`5d10e9`)
        embed.setFooter(`Prefer a no-embed simpler help command? Try ${prefix}oldhelp`)
        
        // For each category, get all the commands in that category, get how many there are
        for (let category in categories) {
            categories[category].commands = main.commands.filter(x => x.info.type == category)
        }

        // Check if the user is asking for help on a particular category
        let validCategories = Object.keys(categories).filter(x => x.startsWith(args[1]))
        if (validCategories.length == 1) {
            let category = validCategories[0], x = categories[category], desc = `${x.desc}\n\n`
            x.commands.forEach(c => {
                let usage = "", aliases = ""
                if (c.info.usage) usage = `\`\n${prefix}${c.info.name} ${c.info.usage}\``
                if (c.info.aliases) {
                    aliases += `\n`
                    for (alias in c.info.aliases) aliases += ` *${prefix}${c.info.aliases[alias]}*`
                }
                else aliases = String()
                desc += `**${prefix}${c.info.name}**${aliases}${usage}\n${c.info.summary}\n\n`
            })
            embed.setTitle(`${bot.user.username} - Help For '${modules.capitalise(category)}' Category ${x.emote}`)
            embed.setDescription(desc)
            message.channel.send({embed})
        }
        else if (content) msg = `I didn't find a category matching '${content}'. Have the default help command instead.` 
        else {

            for (let category in categories) {
                let x = categories[category], name = modules.capitalise(category)
                if (x.displayName) name = x.displayName
                embed.addField(`${x.emote}${name}`, `*${prefix}help ${category}*\n**${x.commands.size} commands**\n${x.summary}`, true)
            }
            embed.addField("\u200B", "\u200B", true)

            embed.setTitle(`${bot.user.username} - Help Menu`)
            embed.setThumbnail("https://cdn.discordapp.com/attachments/462595212783648768/529696718497775617/iu.png")

            message.channel.send(msg, {embed})
        }
    },
    info: {
        name: `help`,
        type: `info`,
        aliases: ["commands"],
        usage: `(category OR command)`,

        summary: `This help command.`
    }
}