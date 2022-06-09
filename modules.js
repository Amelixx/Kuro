const Discord = require(`discord.js`)

const fs = require(`fs`)
const snekfetch = require(`snekfetch`)

const chalk = require(`chalk`)

const settings = require(`./JSON/settings.json`)

const config = settings

let userinfo = require(`./JSON/userinfo.json`),
items = require(`./JSON/items.json`),
guildinfo = require(`./JSON/guildinfo.json`),


globalStats = require(`./JSON/Stats/globalStats.json`),
serverStats = require(`./JSON/Stats/serverStats.json`),
userStats = require(`./JSON/Stats/userStats.json`),
_ = require('lodash/fp');

let achievements = require(`./achievements.js`)
const Pet = require('./Pet.js')
const pets = require('./JSON/pets.json')

module.exports.run = (bot, clone) => {

module.exports.cacheUsers = async () => {
    if (clone != 1) return;
    let userCache = require(`./JSON/userCache.json`)
    console.log(chalk.yellow(`Caching ${Object.keys(userCache).length} users...`))

    userCache.forEach(user => {
        bot.users.cache.set(user.id, new Discord.User(bot, user))
    })

    for (let id in userinfo) {
        if (bot.users.cache.get(id)) continue;
        let user = await bot.users.fetch(id)
        bot.users.cache.set(id, new Discord.User(bot, user))
    }
    fs.writeFileSync(`./JSON/userCache.json`, JSON.stringify(bot.users.cache, null, 4))
    console.log(chalk.green("Done"))
}

module.exports.vowels = new Array(`a`,`e`,`i`,`o`,`u`)

module.exports.range = async (start, stop, step) => {
    var a=[start], b=start;
    while(b<stop){b+=step;a.push(b)}
    return a;
};

module.exports.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.maxInArray = (array) => {
    let max = array.reduce(function(a, b) {
        return Math.max(a, b);
    });
    return max
}

module.exports.registerUser = (user) => {
    id = user.id
    if (!id) return bot.users.cache.get(`97238312355364864`).send(`Error registering user, ID was given instead of a user object.`)
    if (userinfo[id]) return false;

    userinfo[id] = {money: 0, inventory: {}, cooldowns: {}, profile: {}, achievements: []}
    if (user.bot) userinfo[id].bot = true
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.registerGuild = (guild) => {
    id = guild.id
    if (!id) return bot.users.cache.get(`97238312355364864`).send(`Error registering guild, ID was given instead of a guild object.`)

    guildinfo[id] = {}
    fs.writeFileSync(`./JSON/guildinfo.json`, JSON.stringify(guildinfo, null, 4))
}

module.exports.delay = async (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

module.exports.capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.restart = async (bot) => {
    console.log(chalk.red(`Restarting...`))
    await bot.destroy()
    await require(`./Kuro.js`).run()
}

module.exports.createHelp = (command, prefix) => {
    if (!command) return;
    let msg = command.help
    while (msg.includes(`%PREFIX%`)) {msg = msg.replace(`%PREFIX%`, prefix)}
    return msg;
}


module.exports.gameMessages = [
    `No, I assure you; >rob Rubix IS the best way to get money.`,
    `Does anyone even look at this?`,
    `Have any suggestions? Post them on my server! (>info)`,
    `No matter what you may think, someone out there loves you <3`,
    `I don't really have anything else to say.`,
    `Stop trying to marry me!!`,
    `Making your day a better day.`,
    `OwO, what's this?`,
    `\"Failure, is just another kind of success. A bad kind.\"`,
    "Hello world!",
    "\"Opinions are like orgasms, I only care about mine and it doesn't matter if you have one. ~Alex, 2018\"",
    "No, I'm not worried about coronavirus. I'm a piece of software on my dead owner's computer!",
    "Now fully supporting discord.js V12!",
    "\"I love you more than praying mantis videos\" ~Wubblu, 2020",
    "My creator wrote this because she ran out of ideas.",
    "\"    \" ~Nikolai, 2017",
    `"Make it fucking work. ~Robertvson, 2016"`,
    `"Objectivity must exist for subjectivity to have meaning!" ~T3hSource, 2017`,
    `"Insert quote here" ~Luke, 2017`,
    `"If you were a vegetable, you’d be a ‘cute-cumber.’" ~The developer's girlfriend`
]

module.exports.setGame = async () => {
    gameMessage = this.gameMessages[this.randomInt(0, this.gameMessages.length - 1)] 

    await bot.user.setActivity(`@Kuro help | [${clone}] | ${gameMessage}`, {type: `PLAYING`}).catch((e) => {console.error(chalk.red(`Error when setting status:\n${e}`))})
    return `Set status to ${bot.user.presence.game}`
}

module.exports.backupJSON = () => {
    if (clone != 1) return;
    let databases = [
        {path: `userinfo.json`, data:userinfo},
        {path: `Stats/globalStats.json`, data: globalStats},
        {path: `Stats/serverStats.json`, data: serverStats},
        {path: `Stats/userStats.json`, data: userStats}
    ]

    databases.forEach(x => {
        fs.writeFileSync(`../Backup/${bot.user.username}/JSON/${x.path}`, JSON.stringify(x.data, null, 4))
    })
    console.log(chalk.green(`Backed up JSON files.`))
    return "Backed up JSON files."
}

module.exports.addAchievements = (user, achieved, removeAchievements) => {
    userinfo = require(`./JSON/userinfo.json`)
    achievements = require(`./achievements.js`)
    let embed = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    .setTimestamp(Date.now())

    if (!userinfo[user.id].achievements) userinfo[user.id].achievements = []

    let rewards = {
        "Bronze": 1000,
        "Silver": 3000,
        "Gold": 6000,
        "Platinum": 12000
    }, money = 0

    achieved.forEach(name => {
        if (userinfo[user.id].achievements.includes(name)) achieved.splice(achieved.indexOf(name), 1)
        else money += rewards[achievements[name].rarity]
    })

    if (removeAchievements) removeAchievements.forEach(name => {
        userinfo[user.id].achievements.splice(userinfo[user.id].achievements.indexOf(name), 1)
        this.removeMoney(user, rewards[achievements[name].rarity])
    })

    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    if (achieved.length == 0) return false;

    if (achieved.length == 1) {
        embed.setTitle("Achievement Unlocked!")
        embed.setDescription(`**${achieved[0]}**\n*${achievements[achieved[0]].description}*\nYou earned **$${money.toLocaleString()}!**`)
    }
    else {
        embed.setTitle(`${achieved.length} Achievements Unlocked!`)
        let s = "";
        achieved.forEach(name => {s += `**${name}**\n*${achievements[name].description}*\nYou earned **$${rewards[achievements[achieved[0]].rarity].toLocaleString()}!**\n\n`})
        s += `In total, that's **$${money.toLocaleString()}!**`
        embed.setDescription(s)
    }

    this.addMoney(user, money)

    userinfo[user.id].achievements.push(...achieved)
    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    return embed
}

module.exports.checkAchievements = async (user) => {
    achievements = require(`./achievements.js`)
    let achieved = [], removed = []

    if (!userinfo[user.id] || user.bot) return;
    if (!userinfo[user.id].achievements) userinfo[user.id].achievements = []

    for (let name in achievements) {
        if (name == "This is where the development happens.. 👀" && clone == 1) continue;
        if (achievements[name].check && await achievements[name].check(user) && !userinfo[user.id].achievements.includes(name)) achieved.push(name)

        if (achievements[name].removeable && userinfo[user.id].achievements.includes(name) && achievements[name].check && !(await achievements[name].check(user))) {
            removed.push(name)
        }
    }
    return this.addAchievements(user, achieved, removed)
}

module.exports.cleanUserinfo = () => {
    if (clone != 1) return;
    let defaultData = {
        "money": 0,
        "inventory": {},
        "cooldowns": {},
        "profile": {},
        "achievements": []
    }, 
    noAchievements = {
        "money": 0,
        "inventory": {},
        "cooldowns": {},
        "profile": {}
    },
    count = 0
    for (let id in userinfo) {
        if (_.isEqual(userinfo[id], defaultData) || _.isEqual(userinfo[id], noAchievements)) {delete userinfo[id]; count ++}
    }
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
    console.log(chalk.green(`[Userinfo] Cleaned ${count} redundant entries.`))
}

module.exports.updateStats = () => {
    snekfetch.post(`https://discordbots.org/api/bots/stats`)
        .set('Authorization', settings.DBLtoken)
        .send({ server_count: bot.guilds.cache.size })
        .then(() => console.log(chalk.green('Discord Bot List stats updated.')))
        .catch(err => console.error(`Error in updating DBL Stats.\n ${err.message}`));

    return "Updated Discord Bot List stats."
}

module.exports.updateCmdStats = (cmd, message) => {
    if (!cmd || !cmd.info) return;
    if (message.guild) {
        if (!serverStats[message.guild.id]) serverStats[message.guild.id] = { "Command Usage": { "Total Commands": { "total": 1 } } }
        else serverStats[message.guild.id][`Command Usage`][`Total Commands`].total++

        if (!serverStats[message.guild.id][`Command Usage`][message.author.id]) serverStats[message.guild.id][`Command Usage`][message.author.id] = { "total": 1 }
        else serverStats[message.guild.id][`Command Usage`][message.author.id].total++

        if (!serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name]) serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name] = 1
        else serverStats[message.guild.id][`Command Usage`][message.author.id][cmd.info.name]++

        if (!serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name]) serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name] = 1
        else serverStats[message.guild.id][`Command Usage`][`Total Commands`][cmd.info.name]++

        fs.writeFile(`../Kuro/JSON/Stats/serverStats.json`, JSON.stringify(serverStats, null, 4), err => { if (err) throw err })
    }

    if (!userStats[message.author.id]) userStats[message.author.id] = { "Command Usage": { "total": 1 } }
    else userStats[message.author.id][`Command Usage`].total++

    if (!userStats[message.author.id][`Command Usage`][cmd.info.name]) userStats[message.author.id]["Command Usage"][cmd.info.name] = 1
    else userStats[message.author.id][`Command Usage`][cmd.info.name]++
    fs.writeFile(`../Kuro/JSON/Stats/userStats.json`, JSON.stringify(userStats, null, 4), err => { if (err) throw err })

    globalStats[`Command Usage`].total++
    if (!globalStats[`Command Usage`][cmd.info.name]) globalStats[`Command Usage`][cmd.info.name] = 1
    else globalStats[`Command Usage`][cmd.info.name]++
    fs.writeFile(`../Kuro/JSON/Stats/globalStats.json`, JSON.stringify(globalStats, null, 4), err => { if (err) throw err })
}

module.exports.sendMenu = async (user, channel, attributes, options) => {
    // Sends a menu containing {options}, and awaits a user response which it then returns.
    if (!channel || !options || !attributes || !attributes.title) return;
    let msg = `\`\`\`nginx\n${attributes.title}\n\n${attributes.description}\n`

    for (let i in options) {
        msg += `[==[${Number(i)+1}]==] ${options[i]}\n`
    }
    msg += `\nReply with your desired option by entering its number.\nThis message automatically times out in 60 seconds.\nType 'exit' or 'quit' to cancel.\n\`\`\``
    botMsg = await channel.send(msg)

    answer = await channel.awaitMessages(m => (m.content.toLowerCase() == 'exit' || m.content.toLowerCase() == 'quit' || (m.content > 0 && m.content <= options.length)) && m.author.id == user.id, {max: 1, time: 60000, errors: ['time']})
    .catch(c => {botMsg.delete(); channel.send(`⏰ Menu timed out due to inactivity.`).catch(e => {console.error(e)})})
    if (!botMsg || !answer) return false
    answer = answer.first()
    if (['exit', 'quit'].includes(String(answer.content).toLowerCase())) {botMsg.delete(); return false}
    else {botMsg.delete(); return Object(answer)}
}

/**
 * Like sendMenu(), but sends a single question wherein the filter can be customised as it isn't restricted to numbers.
 * Returns a Discord Message instead of a string for the answer. The Message being the user's reply.
 * @param {Discord.User} user 
 * @param {Discord.Channel} channel 
 * @param {String} question 
 * @param {Function} filter 
 * @param {Number} tim
 * @returns {Promise<Discord.Message | false>}
 */
module.exports.sendQuestion = async (user, channel, question, filter, time=30000) => {
    if (!channel || !question || !filter) throw Error(`sendQuestion -> No channel, question, or filter provided.`)

    botMsg = await channel.send(question + `\n\`\`\`http\nType 'exit' or 'quit' to cancel.\n\`\`\``)

    
    answer = await channel.awaitMessages(async m => {return (await filter(m) == true || m.content.toLowerCase() == 'exit' || m.content.toLowerCase() == 'quit') && m.author == user}, {max: 1, time: time, errors: ['time']})
    .catch(c => {botMsg.delete(); channel.send(`⏰ Timed out due to inactivity.`)})
    if (!botMsg || !answer || answer.length == 0) return false

    answer = answer.first()
    if (['exit', 'quit'].includes(String(answer.content).toLowerCase())) {botMsg.delete(); return false}
    else {botMsg.delete(); return answer}
}

module.exports.suffix = (number) => {
    if (String(number).endsWith("1") && number != 11) numbersuffix = "st"
    else if (String(number).endsWith("2") && number != 12) numbersuffix = "nd"
    else if (String(number).endsWith("3") && number != 13) numbersuffix = "rd"
    else numbersuffix = "th"
    return numbersuffix
}

module.exports.welcomeVariables = {
    "%member_mention%": "Mentions the member/bot that joins",
    "%member_tag%": "The tag, e.g 'username#0000'",
    "%member_name%": "username",
    "%member_count%": "The member count after the user joins",
    "%place%": `The nth member of your server, e.g "4th" or "321st"`
}

module.exports.formatWelcomeMsg = (string, member) => {
    let variables = [member, member.user.tag, member.displayName, member.guild.memberCount, `${member.guild.memberCount}${this.suffix(member.guild.memberCount)}`]
    for (let replace in this.welcomeVariables) {
        while (string.includes(replace)) string = string.replace(replace, variables[Object.keys(this.welcomeVariables).indexOf(replace)])
    }
    return string
}

module.exports.mOcK = (msg) => {    
    // The bad code is not my fault I copied it from a python program if someone reads this, shut up
    let str = "";
    [...msg].forEach((l, i) => {
        if (str.length < 2) {
            if (!this.randomInt(0,1)) str += l.toUpperCase()
            else str += l.toLowerCase()
        }
        else {
            if (isUpper(str[i-2]) && isUpper(str[i-1]) || isLower(str[i-2]) && isLower(str[i-1])) {
                if (isUpper(str[i-1])) str += l.toLowerCase()
                else str += l.toUpperCase()
            }
            else {
                if (!this.randomInt(0,1)) str += l.toUpperCase()
                else str += l.toLowerCase()
            }
        }
    })
    return str
}

isUpper = (str) => {
    return str == str.toUpperCase()
}

isLower = (str) => {
    return str == str.toLowerCase()
}

module.exports.getTime = (date, add, noChanging) => {
    if (!noChanging) {
        if (!add) date -= Date.now()
        else date += Date.now()
    }

    let seconds = Math.round(date / 1000),
    minutes = Math.floor(seconds / 60);
    seconds =  seconds % 60;

    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    let days = Math.floor(hours / 24);
    hours = hours % 24;

    return {
        days: Math.round(days),
        hours: Math.round(hours),
        minutes: Math.round(minutes),
        seconds: Math.round(seconds)
    }
}

module.exports.getTimeString = async (date, noChanging) => {
    let times = await this.getTime(date, false, noChanging)
    
    if (times.days == 0) times.days = false
    if (times.hours == 0) times.hours = false
    if (times.minutes == 0) times.minutes = false
    if (times.seconds == 0) times.seconds = false

    if (times.days > 1) {dayS = "s";} else dayS = ""
    if (times.hours > 1) { hourS = "s"; } else hourS = ""
    if (times.minutes > 1) minuteS = "s"; else minuteS = ""
    if (times.seconds > 1) secondS = "s"; else secondS = ""

    let out = ""

    if (times.hours && !times.minutes && !times.seconds) out = `${times.hours} hour${hourS}`
    else if (!times.hours && times.minutes && !times.seconds) out = `${times.minutes} minute${minuteS}`
    else if (!times.hours && !times.minutes && times.seconds) out = `${times.seconds} second${secondS}`

    else if (times.hours && times.minutes && times.seconds) out = `${times.hours} hour${hourS}, ${times.minutes} minute${minuteS} and ${times.seconds} second${secondS}`
    else if (times.hours && times.minutes && !times.seconds) out = `${times.hours} hour${hourS} and ${times.minutes} minute${minuteS}`
    else if (times.hours && !times.minutes && times.seconds) out = `${times.hours} hour${hourS} and ${times.seconds} second${secondS}`
    else if (!times.hours && times.minutes && times.seconds) out = `${times.minutes} minute${minuteS} and ${times.seconds} second${secondS}`
    else if (!times.days && !times.hours && !times.minutes && !times.seconds) out = `0 seconds. (About now)`

    if (times.days) out = `${times.days} day${dayS}, ${out}`

    if (out) return out
    else return new String(`${hours} ${minutes} ${seconds}`)
}

module.exports.fetchRole = (arg, guild, firstMatch=false) => {
    if (!arg) return false
    let filter = r => r.name.toLowerCase().startsWith(arg.toLowerCase()) || arg.includes(`<@&${r.id}>`) || arg == r.id,

    roles = guild.roles.cache.filter(filter).array()
    if (firstMatch && roles.length == 0) return false

    if (roles.length == 1 || firstMatch) return new Object(roles[0])
    else if (roles.length == 0) return false
    else return Array(roles)
}

module.exports.findRole = (guild, search) => {
    let filter = x => x.name.toLowerCase().startsWith(search.toLowerCase()) || x.id == search

    let roleArray = guild.roles.cache.filter(filter).array()
    if (roleArray.length == 1) return roleArray[0]
    else if (roleArray.length == 0) return false
    else return roleArray
}

module.exports.fetchGuild = (search) => {
    if (!search || search == "") throw Error(`Error in fetching guild: 'search' is undefined or null.`)
    let filter = x => x.name.toLowerCase().startsWith(search.toLowerCase()) || x.id == search
    let guild = bot.guilds.cache.filter(filter).array()

    if (guild.length == 0) return false
    if (guild.length == 1) return guild[0]
    else return guild
}

module.exports.findInvite = async (guild) => {
    let invites = await guild.fetchInvites(),
    invite = invites.find(x => x.maxAge == 0) || invites.find(x => x.maxUses == 0)
   
    if (!invite) invite = invites.first()
    
    if (invite) return invite
    else return null
}

module.exports.separateBots = async (guild) => {
    let members = new Object({
        bots: new Number(),
        humans: new Number()
    })
    guild.members.cache.forEach(async member => {
        if (member.user.bot) members.bots ++
        else members.humans ++
    })
    return members
}

module.exports.fetchChannel = (arg, guild=undefined, firstMatch=false) => {
    if (!arg) return false
    let channels, filter = c => c.name.toLowerCase().startsWith(arg.toLowerCase()) || arg.includes(`<#${c.id}>`) || arg == c.id

    if (guild) channels = guild.channels.cache.filter(filter).array()
    else if (guild == undefined) channels = bot.channels.filter(filter).array()

    if (firstMatch && channels.length == 0) return false

    if (channels.length == 1 || firstMatch) return new Object(channels[0])
    else if (channels.length == 0) return false;
    else return Array(channels)
}

module.exports.fetchUser = async (arg) => {
    if (!arg) return false
    else if (arg.toLowerCase() == "greg") return bot.users.cache.get(`257482333278437377`)
    let users = bot.users.cache.filter(user => user.tag.toLowerCase().startsWith(arg.toLowerCase()) || arg == `<@!${user.id}>` || arg == user.id || user.discriminator.startsWith(arg)).array()
    if (users.length == 1) return new Object(users[0])
    else if (users.length == 0) return await bot.users.fetch(arg).catch(err => {return false})
    else return Array(users)
}

module.exports.getUser = async (search, errorChannel) => {
    let user = await this.fetchUser(search)
    if (Array.isArray(user)) {
        let embed = new Discord.MessageEmbed()
        .setTitle(`More than one match.`)
        .setDescription(`More than user found, did you mean one of the following?\n${user.join("  ")}`)
        errorChannel.send({embed})
        return undefined
    }
    if (!user) {
        errorChannel.send(`I couldn't find a user matching \`${search}\`.`)
        return undefined
    }
    else return user
}

module.exports.fetchMember = (guild, search) => {
    if (!search) return false
    search = search.toLowerCase()

    filter = member => member.user.tag.toLowerCase().startsWith(search) || member.user.id == search || search.includes(`<@!${member.id}>`) || search.includes(`<@${member.id}>`)
            || member.user.discriminator.startsWith(search) || member.displayName.toLowerCase().startsWith(search)
    member = guild.members.cache.filter(filter).array()

    if (member.length == 1) return member[0]
    else if (member.length == 0) return false
    else return member
}

module.exports.getMember = (guild, search, errorChannel) => {
    let member = this.fetchMember(guild, search)
    if (Array.isArray(member)) {
        let embed = new Discord.MessageEmbed()
        .setTitle(`More than one match.`)
        .setDescription(`More than user found, did you mean one of the following?\n${member.join("  ")}`)
        errorChannel.send({embed})
        return undefined
    }
    if (!member) {
        errorChannel.send(`I couldn't find a user matching \`${search}\`.`)
        return undefined
    }
    else return member
}

module.exports.findInArray = async (array, element) => {
    let count = 0
    await array.forEach(async (x) => {
        if (await x.toLowerCase().startsWith(element.toLowerCase())) { element = x; count ++}
    });

    if (count == 0 || !array.includes(element)) return false
    else if (count > 1) return false
    else return element
}

/**
 * Attempts to get a pet, and sends error messages if applicable, returning "undefined" if this happens.
 * @param {String} search String to search pets for
 * @param {Discord.Channel} errorChannel Channel to send error message, if any
 * @returns {String | undefined}
 */
module.exports.getPet = (search, errorChannel) => {
    let pet = this.fetchPet(search);
    if (Array.isArray(pet)) {
        let embed = new Discord.MessageEmbed()
        .setTitle(`More than one match.`)
        .setDescription(`More than pet found, did you mean one of the following?\n${pet.join("  ")}`)
        errorChannel.send({embed})
        return undefined
    }
    if (!pet) {
        errorChannel.send(`I couldn't find a pet matching \`${search}\`.`)
        return undefined
    }
    else return pet
}

/**
 * Searches for a pet given a string, returns array of strings or single string matching the search.
 * @param {String} search String to search pets for
 */
module.exports.fetchPet = (search) => {
    let matchingPets = Object.keys(pets).filter(x => x.toLowerCase().startsWith(search.toLowerCase()));

    if (matchingPets.length == 0) return false;
    else if (matchingPets.length == 1) return matchingPets[0];
    else return matchingPets
}

/**
 * Add a pet to a discord user.
 * @param {string} userID Discord user
 * @param {Pet} pet Pet to add
 */
module.exports.addPet = (userID, pet) => {
    if (!userinfo[userID].pets) userinfo[userID].pets = {}

    userinfo[userID].pets
}

module.exports.getMarketItem = (element) => {
    let count = 0
    for (let item in items) {
        if (item.toLowerCase().startsWith(element.toLowerCase()) && items[item].price) { element = item; count ++}
    }

    if (count == 0) return false
    else if (count > 1) return false
    else return element
}

module.exports.getInventory = (user) => {
    if (!userinfo[user.id]) this.registerUser(user)
    let inventory = "", uInventory = userinfo[user.id].inventory
    if (Object.keys(uInventory).length == 0) inventory = `There is nothing.`
    else {
        inventory += `${Object.values(userinfo[user.id].inventory).reduce((a,b) => {return a + b})} Items:\n`
        for (let item in uInventory) {
            inventory = `${inventory}, ${items[item].emoji} x ${uInventory[item]}`
        }
        inventory = inventory.replace(`,`, ``)
    }
    return inventory
}

module.exports.addToInventory = (user, item, amount) => {
    if (!amount || isNaN(amount)) amount = 1

    if (!userinfo[user.id]) this.registerUser(user)

    let uInventory = userinfo[user.id].inventory
    if (!uInventory[item]) uInventory[item] = Number(amount)
    else uInventory[item] += Number(amount)
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.removeFromInventory = (user, item, amount) => {
    if (!amount || isNaN(amount)) amount = 1
    
    if (!userinfo[user.id]) this.registerUser(user)

    let userInventory = userinfo[user.id].inventory
    if (!userInventory[item]) return;
    else if (userInventory[item] == 1 || userInventory[item] == 0 || userInventory[item] == amount) delete userInventory[item]
    else userInventory[item] = userInventory[item] - Number(amount)

    return console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}


module.exports.addMoney = (user, amount) => {
    if (settings.infiniteBalances.includes(user.id)) return;

    if (!userinfo[user.id]) this.registerUser(user)

    userinfo[user.id].money = Number(Number(userinfo[user.id].money) + Number(amount))
    console.log("update userinfo - addMoney"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.removeMoney = (user, amount) => {
    if (settings.infiniteBalances.includes(user.id)) return;

    if (!userinfo[user.id]) this.registerUser(user)

    userinfo[user.id].money = Number(Number(userinfo[user.id].money) - Number(amount))
    console.log("update userinfo"); fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
}

module.exports.sendReactions = async () => {
    // Sends all the appropriate reactions in the roles channel.

    let rolesChannel = bot.channels.cache.get(config.rolesChannelID)

    let genderMsg = await rolesChannel.messages.fetchMessage("689526322728665165")
    await genderMsg.react(`:historychannel:689533964943097943`)
    // await genderMsg.react(`:female:452061730865020928`)

    Object.keys(config.reactionRoles).forEach(async id => {
        let msg = await rolesChannel.messages.fetchMessage(id)
        if (msg) {
            Object.keys(config.reactionRoles[id]).forEach(async x => {await msg.react(x).catch(err => {})})
        }
    })
}

module.exports.getLeaderboardArray = () => {
    let arr = Object.keys(userinfo).sort((a,b) => {return userinfo[b].money - userinfo[a].money})
    return arr.filter(x => {user = bot.users.cache.get(x); if (user) return !user.bot && userinfo[x].money; else return false})
}

module.exports.progressBar = (progress, goal, barCount) => {
    let percentage = progress / goal * 100,
    bars = Math.floor(percentage / (100 / barCount))

    try {
        let filled = "█",
        unfilled = "░"

        progressBar = filled.repeat(bars)
        progressBar += unfilled.repeat(barCount - bars)
    } catch (e) {
        progressBar = `Something went wrong generating a progress bar... Please contact my developer, and send him this so she knows exactly what went wrong: \`${e}\``
    }
    return progressBar
}

}