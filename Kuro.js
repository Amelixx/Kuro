const Discord = require("discord.js");
const settings = require("./JSON/settings.json");
const config = settings;
const chalk = require(`chalk`)

const log = false
const fs = require('fs')

const calls = require(`./JSON/calls.json`)
const guildinfo = require(`./JSON/guildinfo.json`)
let userinfo = require(`./JSON/userinfo.json`),

globalStats = require(`./JSON/Stats/globalStats.json`),
userStats = require(`./JSON/Stats/userStats.json`),
userCache = require(`./JSON/userCache.json`)

/**
 * Runs a Kuro bot
 * @param {Discord.Client} bot 
 * @param {string} token 
 * @param {number} clone 
 */
module.exports.run = async (bot, token, clone) => {

module.exports.bot = bot

let DBL = require('dblapi.js'), dbl;
if (clone == 1) dbl = new DBL(config.DBLtoken, {webhookPort: 4999, webhookAuth: 'fdathfdfe', webhookPath: `/dbl`}),
module.exports.dbl = dbl

let botCommands = new Discord.Collection();
files = fs.readdirSync(`./Commands/`).concat(fs.readdirSync(`./dev_commands/`))

let jsfiles = files.filter(f => f.split(".").pop() === `js`);
if (jsfiles.length <= 0) console.log(chalk.red(`No commands to load.`));
else {
    console.log(chalk.magentaBright(`Loading ${jsfiles.length} commands. . .`))
    for (let file in jsfiles) {
        file = jsfiles[file]
        try {
            if (fs.existsSync(`./Commands/${file}`)) cmd = require(`./Commands/${file}`);
            else cmd = require(`./dev_commands/${file}`)
        }
        catch (e) {console.log(chalk.magenta(`${file} couldn't load properly....` + chalk.red(e))); continue}

        if (!cmd.info) {console.log(chalk.red(`No info for command ${file}!`)); continue}
        if (!cmd.run) {console.log(chalk.red(`No run function for command ${file}!`)); continue}
        let props = cmd;
        botCommands.set(props.info.name, props);
    };
    console.log(chalk.green(`Commands loaded!`))
}
module.exports.botCommands = botCommands
module.exports.commands = new Object(botCommands)

console.log(chalk.magentaBright(`Logging in Kuro ${clone}..`))
await bot.login(token).catch(e => {console.log(`Error when logging in Kuro ${clone}`); console.error(e)})

module.exports.bot = bot
const modules = require(`./modules.js`)
modules.run(bot, clone)

bot.on('ready', async () => {
    console.log(chalk.cyan(`Logged in as...
    
    
    
        KKKKKKKKK    KKKKKKK
        K:::::::K    K:::::K
        K:::::::K    K:::::K
        K:::::::K   K::::::K
        KK::::::K  K:::::KKKuuuuuu    uuuuuu rrrrr   rrrrrrrrr      ooooooooooo
          K:::::K K:::::K   u::::u    u::::u r::::rrr:::::::::r   oo:::::::::::oo
          K::::::K:::::K    u::::u    u::::u r:::::::::::::::::r o:::::::::::::::o
          K:::::::::::K     u::::u    u::::u rr::::::rrrrr::::::ro:::::ooooo:::::o
          K:::::::::::K     u::::u    u::::u  r:::::r     r:::::ro::::o     o::::o
          K::::::K:::::K    u::::u    u::::u  r:::::r     rrrrrrro::::o     o::::o
          K:::::K K:::::K   u::::u    u::::u  r:::::r            o::::o     o::::o
        KK::::::K  K:::::KKKu:::::uuuu:::::u  r:::::r            o::::o     o::::o
        K:::::::K   K::::::Ku:::::::::::::::uur:::::r            o:::::ooooo:::::o
        K:::::::K    K:::::K u:::::::::::::::ur:::::r            o:::::::::::::::o
        K:::::::K    K:::::K  uu::::::::uu:::ur:::::r             oo:::::::::::oo
        KKKKKKKKK    KKKKKKK    uuuuuuuu  uuuurrrrrrr               ooooooooooo
        
        # ${bot.user.discriminator} (${clone})      
        
        
    `))

    globalStats.botStarted = Date.now()
    fs.writeFileSync(`./JSON/globalStats.json`, JSON.stringify(globalStats, null, 4))

    modules.cleanUserinfo()
    await modules.setGame()

    modules.cacheUsers()

    let botHubMembers = bot.guilds.cache.get(`689734320784408667`).members.cache
    module.exports.botHubMembers = botHubMembers

    bot.setInterval(async () => {
        await modules.setGame()
        modules.backupJSON()

        bot.channels.cache.get(settings.guildCountChannel).setName(`${bot.guilds.cache.size.toLocaleString()} Kuro Guilds`)

        let botHubMembers = bot.guilds.cache.get(`689734320784408667`).members.cache
        module.exports.botHubMembers = botHubMembers
    }, 900000 /* 15 minutes */)

    BotHub = bot.guilds.cache.get(`689734320784408667`)
    bot.setInterval(async () => {
        
        for (let id in userinfo) {
            userinfo = JSON.parse(fs.readFileSync("./JSON/userinfo.json"))
            let user = bot.users.cache.get(id)
            if (!user) continue;
            if (!userinfo[id].achievements) userinfo[id].achievements = [];
//            console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))

            // Give money roles
            Object.keys(settings.moneyRoles).forEach(async (x) => {
                let supportServer = bot.guilds.cache.get("689734320784408667"),
                role = supportServer.roles.cache.get(settings.moneyRoles[x]),
                member = supportServer.member(id)
                if (!member) return;
                if (userinfo[id].money >= Number(x) && !member.roles.cache.has(role.id)) await member.roles.add(role)
                else if (userinfo[id].money < Number(x)) await member.roles.remove(role)
            })



            // Check if user can vote again
            if (userinfo[id].voteReminder && (userinfo[id].nextVote <= Date.now() || !userinfo[id].nextVote) && !userinfo[id].sentReminder) {
                let voteMsgs = [
                    `*Have you remembered to vote today?*`,
                    `You can vote again!`,
                    `You can now vote again for Kuro ;)`,
                    `It would seem you can vote again - go on, **click the button.**`
                ]
                user.send(`${voteMsgs[modules.randomInt(0, voteMsgs.length - 1)]}\nYou asked me to remind you when you can vote again. To disable this, type \`->voteReminder\`.\nhttps://top.gg/bot/${bot.user.id}/vote`)
                userinfo[id].sentReminder = true
            }
        }
        fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))

        // Add Members role to everyone that doesn't have any roles
        BotHub.members.cache.forEach(x => {
            if (x.roles.cache.size == 1) x.roles.add(`689755751929217030`)
        })
    }, 60000 /* 1 minute */)

    bot.setInterval(() => {
        modules.updateStats()

        // Clean up userinfo database
        modules.cleanUserinfo();
    }, 3600000 /*1 hour*/)

    console.log(chalk.cyan(`Creating reaction collectors...`))
    let count = 0;
    for (let id in guildinfo) {
        let info = guildinfo[id]
        if (info.reaction_roles) {
            for (let channelID in info.reaction_roles) {
                for (let messageID in info.reaction_roles[channelID]) {
                    let c = bot.channels.cache.get(channelID)
                    if (c) msg = await c.messages.fetch(messageID).catch(e => {});
                    else continue;
                    try {
                        if (!msg) continue;
                        // console.log(chalk.blue(`Kuro ${clone} creating reaction collector in #${c.name} Msg ID ${msg.id}...`))
                        msg.createReactionCollector((r, u) => true)
                        count ++;
                    } catch (e) {console.log(e)}
                }
            }
        }
    }
    console.log(chalk.green(`Kuro ${clone} successfully created ${count} reaction collectors.`))
});

bot.on('message', async (message) => {
    if (clone != 1 && message.guild && message.guild.members.cache.has("386868728098324481")) return;

    if (!bot.users.cache.get(message.author.id)) bot.users.cache.set(message.author.id, message.author)
    if (message.author.tag != bot.users.cache.get(message.author.id).tag) {
        cache = userCache.find(x => x.id == message.author.id)
        if (cache) cache = message.author
        bot.users.cache.delete(message.author.id)
        bot.users.cache.set(message.author.id, message.author)
    }

    const time = new Date().toUTCString().split(" ")[4]
    const args = message.content.split(/\s+/);

    let x = 0, i = 0
    while (x != 1 && message.content[i]) {
        if (message.content[i] == " ") x ++
        i ++
    }
    let coreMessage = message.content.slice(i)

    if (message.channel.type != "dm" && guildinfo[message.guild.id] && guildinfo[message.guild.id].prefix) prefix = guildinfo[message.guild.id].prefix
    else prefix = settings.defaultPrefix

    if (message.author.id == `97238312355364864`) prefix = settings.defaultPrefix

    if (log && message.author.bot) console.log(chalk.gray(`[BOT MESSAGE] -> Author "${message.author.tag}" | Server "${message.guild.name}" | Channel "#${message.channel.name}"`))
    else if (log) console.log(`[MESSAGE] -> Author "${message.author.tag}" | Server "${message.guild.name}" | Channel "#${message.channel.name}"`)

    if (calls[message.channel.id] && !calls[message.channel.id].calling && !calls[message.channel.id].beingCalled) {
        try {
            if (message.author == bot.user) return;
            linkedChannel = bot.channels.cache.get(calls[message.channel.id].linkedChannel)
            if (!linkedChannel) {
                delete calls[calls[message.channel.id].linkedChannel]
                delete calls[message.channel.id]
            }

            if (log) console.log(chalk.magenta(`---------\n[CALL MODULE] -> Origin: See above channel | Destination: ${linkedChannel.name}\n---------`))

            if (message.channel.guild == linkedChannel.guild) linkedChannel.send(`:telephone_receiver: ${message.channel} | **${message.author.tag}** | ${message.content}`)
            else linkedChannel.send(`:telephone_receiver: **${message.guild.name}** | **${message.author.tag}** | ${message.content}`)
        } catch (error) { console.log(chalk.red(`An error occured in the call module.`) + chalk.redBright(`\n${error}`)) }
    }

    if (message.channel.type == "dm" && !message.content.startsWith(prefix)) {
        if (message.author.id == bot.user.id) return;
        globalStats.lastDM = message.author.id;
        fs.writeFileSync(`./JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4))

        let embed = new Discord.MessageEmbed()
        .setColor(`#f5dbac`)
        .setAuthor(`${message.author.tag} ${message.author.id}`, message.author.displayAvatarURL())
        .setDescription(message.content)
        .setTimestamp(Date.now())

        if (message.content.toLowerCase().includes(`help`)) {
            message.channel.send(`The command in DMs is always ${prefix}help\nIf you would like assistance from our human support team, join the support server here: https://discord.gg/bAqyGbZ`)
            embed.setFooter(`✔️ Help message was sent.`)
        }

        return bot.channels.cache.get(config.dmLogChannel).send({embed})
    }

    if (message.channel.type != "dm" && !message.channel.permissionsFor(message.guild.me).has(`SEND_MESSAGES`)) return;

    if (!message.content.startsWith(prefix) && !message.mentions.users.has(bot.user.id) && !message.content.toLowerCase().startsWith(`kuro,`)) return;
    if (message.author.id == "834152608058572861") return message.channel.send("E-Exchi-chan... y-you can't just *use*  me like that! :flush: unless.. you used the API..? :flush:")
    if (message.author.bot) return;

    if (clone != 1 && message.guild && message.guild.members.cache.has("386868728098324481")) return;

    aliasCheck = `${prefix}%X%`

    if (log) console.log(chalk.yellow(`[COMMAND HANDLER] -> Processing command ${args[0]}. .`))
    // Command Handler
    if (args[0] == `<@${bot.user.id}>` || args[0] == `<@!${bot.user.id}>`) {
        args.splice(0, 1)
        coreMessage = args.slice(1).join(" ")
        cmd = this.botCommands.get(args[0])
        aliasCheck = `%X%`
        if (message.mentions.members) message.mentions.members = message.mentions.members.filter(x => {x != message.mentions.members.first()})
    }
    else if (message.content.toLowerCase().startsWith(`kuro,`)) cmd = this.botCommands.get(`8ball`)
    else if (message.content.startsWith(prefix)) cmd = this.botCommands.get(args[0].toLowerCase().slice(prefix.length));
    else return;
    if (!cmd) this.botCommands.forEach(command => {
        if (command.info.aliases) {
            command.info.aliases.forEach(x => {
                if (args[0] && args[0].toLowerCase() == aliasCheck.replace(`%X%`, x)) { return cmd = command }
            })
        }
    });
    if (cmd) {
        // V (block commands in Rubix Bot Hub General)
        // if (message.channel.parentID == `689734321367679048`) return;
        if (message.channel.type != "dm") {
            // In a guild
            console.log(chalk.cyan(`[Kuro ${clone}] ${time} | ${message.author.tag} executed "${message.content}" | ${message.channel.name} | ${message.guild.name} | ${message.guild.id}`))
        }
        else /*In a DM ->*/ console.log(chalk.cyan(`[Kuro ${clone}] ${time} | ${message.author.tag} executed "${message.content}" | DM Channel`))

        if (cmd.info.ignore) return;
        if (cmd.info.ignoreDM && message.channel.type == `dm`) return message.channel.send(`This command cannot be used in Direct Messages.`)
        if (await cmd.info.developer && !settings.developerIDs.includes(message.author.id)) return;

        if (cmd.info.requiresUserinfo && !userinfo[message.author.id]) try {modules.registerUser(message.author)} catch (e) {console.log(e)}
        if (cmd.info.requiresGuildinfo && !guildinfo[message.guild.id]) try {modules.registerGuild(message.guild)} catch (e) {console.log(e)}

        if (cmd.info.permissions) {
            permissionsNeeded = ""
            for (let i in cmd.info.permissions) {
                perm = cmd.info.permissions[i]
                if (!message.member.hasPermission(perm)) permissionsNeeded += `\`${perm}\`, `
            }
            if (permissionsNeeded) return message.channel.send(`You don't have permission to run this command.\nMissing required permissions: \`${permissionsNeeded.slice(0, permissionsNeeded.length - 2)}\``)
        }
        if (cmd.info.botPermissions) {
            permissionsNeeded = ""
            for (let i in cmd.info.botPermissions) {
                perm = cmd.info.botPermissions[i]
                if (!message.member.hasPermission(perm)) permissionsNeeded += `\`${perm}\`, `
            }
            if (permissionsNeeded) return message.channel.send(`I don't have sufficient permissions to run this command.\nMissing required permissions: \`${permissionsNeeded.slice(0, permissionsNeeded.length - 2)}\``)
        }

        if (cmd.info.cooldown) {
            userinfo = require(`./JSON/userinfo.json`)
            let info = userinfo[message.author.id], cooldown

            if (clone == 1) dblVoted = await dbl.hasVoted(message.author.id).catch(x => {return true})
            else dblVoted = userinfo[message.author.id].votedThisMonth
            if (dblVoted && info.inventory["Crystal Ball"] && cmd.info.name != "daily" && cmd.info.name != "weekly") cooldown = cmd.info.cooldown / 2
            else cooldown = cmd.info.cooldown

            if (!info.cooldowns) userinfo[message.author.id].cooldowns = {}
            if (!info.cooldowns[cmd.info.name] || info.cooldowns[cmd.info.name] <= Date.now()) {
                userinfo[message.author.id].cooldowns[cmd.info.name] = Date.now() + cooldown;
                console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
            }
            else return message.channel.send(`⏱️ Slow down! This command can only be used every **${await modules.getTimeString(cooldown, true)}!**\nYou can use this command again in ${await modules.getTimeString(info.cooldowns[cmd.info.name])}.`)
        }

        if (cmd.info.support && !message.member.roles.cache.has(`695805579163205664`)) return message.channel.send(`This command is reserved for the support staff on Rubix Bot Hub. If you are support, you can only use this command on Rubix Bot Hub.`)

        if (cmd.info.requiresDblVote && !await dbl.hasVoted(message.author.id)) return message.channel.send(`This command requires voting for the bot on Discord Bot List - this supports the bot and is free! You can do so by following this link:\nhttps://top.gg/bot/${bot.user.id}/vote`)

        try {
            // Execute Command
            result = await cmd.run(bot, message, args, coreMessage, prefix)
            if (!result && userinfo[message.author.id]) {
                userinfo = require(`./JSON/userinfo.json`)
                delete userinfo[message.author.id].cooldowns[cmd.info.name]
                fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
            }
            

            // Update statistics
            modules.updateCmdStats(cmd, message)

            // Check for achievements
            userinfo = require(`./JSON/userinfo.json`)

            let embed = await modules.checkAchievements(message.author)
            if (embed) message.channel.send({embed}).catch(e => {});


    } catch (error) {
            if (cmd && cmd.info) message.channel.send(`An error occured while running this command. The error has been logged.\n\`\`\`${error}\`\`\`\nContact ${bot.users.cache.get("97238312355364864").tag} if this happens frequently.`)
            if (cmd && cmd.info.name) name = cmd.info.name
            else name = "unknown"
            console.error(`Error running ${name}:`)
            console.error(error)
        }
    }
});

if (clone == 1) {
    dbl.webhook.on('ready', hook => {
        console.log(chalk.green(`DBL webhook ready.\n${hook}`))
    })

    dbl.webhook.on('vote', vote => {
        let date = new Number(Date.now()),
        user = bot.users.cache.get(vote.user)
        if (user) {
            console.log(chalk.green(`${user.tag} just voted!`))
            if (!userinfo[user.id]) modules.registerUser(user)
            if (!userStats[user.id]) userStats[user.id] = {"Command Usage": {"total": 0}, votes: 0}
            userinfo[user.id].votedThisMonth = true;
            userinfo[user.id].nextVote = date + 43230000 // 12 Hours and 30 seconds
            userinfo[user.id].sentReminder = false
            console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    
            userStats[user.id].votes ++
            fs.writeFileSync(`./JSON/Stats/userStats.json`, JSON.stringify(userStats, null, 4))
    
            if (userinfo[user.id] && userinfo[user.id].votedThisMonth) return; 
            user.send(`Thank you for voting for Kuro! This message only sends the first time you vote for Kuro in a month, so don't worry about spam.\nVoting allows you to buy the crystal ball and will reduce your cooldowns!\nIf you'd like me to remind you when you can vote again, simply run \`->voteReminder\` right now. Have a nice day!`)
        }
    })
}

bot.on('guildCreate', async (guild) => {
    let otherKuros = ["386868728098324481", "650085922360262658", "670779750934904846"]
    for (let x in otherKuros) {                                                       /*   Rubix Box Hub        Rubix's Corner     */
        if (guild.members.cache.has(otherKuros[x]) && otherKuros[x] != bot.user.id && !["689734320784408667", "366204534567075840"].includes(guild.id)) {
            console.log(`${bot.user.username} ${clone} leaving ${guild.name} due to other Kuros..`)
            return guild.leave()
        }
    }

    console.log(`${bot.user.username} ${clone} was added to "${guild.name}"`)
    await modules.setGame()
    bot.channels.cache.get(settings.guildCountChannel).setName(`${bot.guilds.cache.size.toLocaleString()} Kuro Guilds`)

    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))

    let members = await modules.separateBots(guild)
    let invite = await modules.findInvite(guild).catch(e => {return null})
    if (invite) inviteString = `[https://discord.gg/${invite.code}](https://discord.gg/${invite.code})`
    if (!invite) inviteString = `I couldn't find an invite :(`

    if (guild.me.hasPermission(`ADMINISTRATOR`)) admin = `Yes >:D`
    else admin = `No ;-;`

    let embed = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL())
        .addField(`ID`, guild.id, true)
        .addField(`Server Owner`, guild.owner.user.tag, true)
        .addField(`Humans | Bots | Total`, `${members.humans} | ${members.bots} | ${guild.memberCount}`, true)
        .addField(`Administrator`, admin)
        .addField(`Invite`, inviteString, true)

    let channel = bot.channels.cache.get(settings.guildLogChannel)
    channel.send({ embed })
})

bot.on(`guildDelete`, async (guild) => {
    if (!guild || !guild.name) return;

    let owner = "Couldn't get :C"
    if (guild.owner) owner = `${guild.owner.user.tag} (${guild.ownerID})`
    let embed = new Discord.MessageEmbed()
        .setColor(`FD0404`)
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL())
        .addField(`ID`, guild.id, true)
        .addField(`Server Owner`, owner, true)
        .addField(`Total Members`, guild.memberCount, true)

    let channel = bot.channels.cache.get(settings.guildLogChannel)
    channel.send({ embed })
    console.log(chalk.red(`${bot.user.username} ${clone} was kicked/banned from "${guild.name}"`))
    modules.setGame()
    bot.channels.cache.get(settings.guildCountChannel).setName(`${bot.guilds.cache.size.toLocaleString()} Kuro Guilds`)

    if (guildinfo[guild.id] && Object.keys(guildinfo[guild.id]).length == 0) delete guildinfo[guild.id]
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))
})

bot.on(`guildMemberAdd`, async (member) => {
    if (log) console.log(chalk.blue(`[GUILD MEMBER ADD] -> Guild "${member.guild.name}" | Member "${member.user.tag}"`))
    if (member.guild.id == /*Kuro/Warbot Hub*/`677471030238773259`) {
        let embed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`${member} joined my server! (${member.user.tag})`)

            .setTimestamp(Date.now())

        member.guild.channels.cache.get(`678050509931937802`).send({ embed })
    }
    let info = guildinfo[member.guild.id]
    if (!info) return;

    // Welcome Messages
    if (info.welcome && info.welcome.channels && info.welcome.channels.length > 0) {
        for (let x in info.welcome.channels) {
            c = bot.channels.cache.get(info.welcome.channels[x])
            if (!c) return;
            if (member.user.bot && info.welcome.newBotMessage) c.send(modules.formatWelcomeMsg(info.welcome.newBotMessage, member))
            if (!member.user.bot && info.welcome.newMemberMessage) c.send(modules.formatWelcomeMsg(info.welcome.newMemberMessage, member))
        }
    }

    // Autoroles
    try {
    if (!guildinfo[member.guild.id] || !guildinfo[member.guild.id].autoRoles) return;
    console.log(chalk.yellow(`Trying autoroles for ${member.guild.name}:`))
    let Kuro = member.guild.me,
    autoRoles = guildinfo[member.guild.id].autoRoles;

    let newMemberRole = member.guild.roles.cache.get(autoRoles.newMemberRole),
    newBotRole = member.guild.roles.cache.get(autoRoles.newBotRole)

    console.log(chalk.yellow(`New member role -> ${newMemberRole}\nNew Bot Role -> ${newBotRole}`))

    if (newMemberRole) memberCheck = Kuro.roles.highest.position >= newMemberRole.position
    else memberCheck = false
    if (newBotRole) botCheck = Kuro.roles.highest.position >= newBotRole.position
    else botCheck = false

    console.log(chalk.yellow(`memberCheck -> ${memberCheck}\nbotCheck -> ${botCheck}`))

    if (!Kuro.hasPermission(`MANAGE_ROLES`)) return;

    if (member.user.bot && botCheck) {
        console.log(chalk.cyan(`Autoroles for ${member.guild.name}:`))
        await member.roles.add(newBotRole, `Kuro Autorole`)
        console.log(chalk.green(`Added ${newBotRole.name} to [Bot] ${member.user.tag}`))
    }
    if (memberCheck) {
        console.log(chalk.cyan(`Autoroles for ${member.guild.name}:`))
        await member.roles.add(newMemberRole, `Kuro Autorole`)
        console.log(chalk.green(`Added ${newMemberRole.name} to ${member.user.tag}`))
    }
    } catch (e) {console.log(`An error occurred in the autoroles module.\n${e}`)}
});

bot.on('guildMemberRemove', async (member) => {
    if (log) console.log(chalk.blue(`[GUILD MEMBER REMOVE] -> Guild "${member.guild.name}" | Member "${member.user.tag}"`))
    if (member.guild.id == /*Kuro/Warbot Hub*/`677471030238773259`) {
        let embed = new Discord.MessageEmbed()
            .setColor(`FD0404`)
            .setDescription(`${member} left my server. (${member.user.tag})`)

            .setTimestamp(Date.now())

        await member.guild.channels.cache.get(`678050509931937802`).send({ embed })
    }
})

bot.on(`messageDelete`, async (message) => {
    if (log) console.log(chalk.blueBright(`[MESSAGE DELETE] -> Guild "${message.guild}" | Author "${message.author}"`))

    if (clone != 3) return;
    // Log deleted messages in Lipu Tenpo
    let ignoreChannels = [...bot.channels.cache.get("795630122211868693").children.keys(), "796035660715917342", "804486895060779008", "796035660715917342", "796458717913677846"], // and ignore these channels
    c = bot.channels.cache.get("815367306821500959");
    if (c && message.guild.id == "795288348024373289" && message.channel != c && !ignoreChannels.includes(message.channel.id)) {
        let embed = new Discord.MessageEmbed()
        .setColor(`#f5dbac`)
        .setAuthor(`${message.author.tag} deleted a message in #${message.channel.name}:`, message.author.displayAvatarURL())
        .setDescription(message.content)
        .setTimestamp(Date.now())
        .setFooter(`User ID: ${message.author.id}`)

        c.send({embed})
    }
})

bot.on(`messageReactionAdd`, async (reaction, user) => {
    let msg = reaction.message
    if (user.bot || !msg.guild || !guildinfo[msg.guild.id]) return;

    // Check message is actually one of the reaction messages
    let info = guildinfo[msg.guild.id].reaction_roles
    if (!info || !Object.keys(info).includes(msg.channel.id) || !Object.keys(info[msg.channel.id]).includes(msg.id)) return;

    let role = msg.guild.roles.cache.get(info[msg.channel.id][msg.id][reaction.emoji.name])

    if (!role) return;
    let member = msg.guild.member(user)
    if (member.roles.cache.has(role.id)) {
        member.roles.remove(role, `Self assignable role request.`)
        return reaction.users.remove(user.id).catch(e => {})
    }

    // let years = hasRoleInArray(member, settings.years, role),
    // type = ``

    // if (settings.years.includes(role.id) && years) {
    //     let roleToRemove = years
    //     member.roles.remove(roleToRemove)

    //     let otherEmoji = Object.keys(config.reactionRoles[reaction.message.id]).find(x => config.reactionRoles[reaction.message.id][x] == roleToRemove.id)
    //     await reaction.message.reactions.find(x => x.emoji.name == otherEmoji).remove(user)

    //     let a = "a"; if (modules.vowels.includes(type[0])) a = "an"
    //     description = `You already have the \`${roleToRemove.name}\` role, which is ${a} ${type}. It has been replaced with \`${role.name}\`.`
    // }

    member.roles.add(role, `Self assignable role request.`)
    user.send(`**Added** the \`${role.name}\` role.`)
})

bot.on(`messageReactionRemove`, async (reaction, user) => {
    let msg = reaction.message
    if (user.bot || !msg.guild || !guildinfo[msg.guild.id])  return;

    info = guildinfo[msg.guild.id].reaction_roles
    if (!info || !Object.keys(info).includes(msg.channel.id) || !Object.keys(info[msg.channel.id]).includes(msg.id)) return;

    let role = msg.guild.roles.cache.get(info[msg.channel.id][msg.id][reaction.emoji.name])
    if (!role) return;
    let member = reaction.message.guild.member(user)
    if (!member.roles.cache.has(role.id)) return;

    member.roles.remove(role, `Self assignable role request.`)
    user.send(`**Removed** the \`${role.name}\` role.`)
})

hasRoleInArray = (member, array, role) => {
    for (x in array) {
        if (member.roles.cache.has(array[x]) && array[x] != role.id) return member.guild.roles.cache.get(array[x])
    }
    return false
}

bot.on(`error`, async (err) => {
    console.log(chalk.red(`Unexpected error...\n`) + chalk.redBright(`${err.message}\nIn file ${err.fileName}, line ${err.lineNumber}`))
})

bot.on(`shardDisconnect`, (event, shardID) => {
    console.log(`${bot.user.username} (Shard ${shardID}) has disconnected. Attempting to reconnect...`)
    return this.run()
})


return bot
}

for (let i in settings.tokens) {
    console.log(chalk.blue(`Launching Kuro ${Number(i)+1}..`))
    this.run(new Discord.Client(), settings.tokens[i], Number(i)+1)
}
// settings.tokens.forEach(async (x, i) => {
//     await this.run(new Discord.Client(), x, i+1);
// })