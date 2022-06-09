const Discord = require(`discord.js`)

const userinfo = require(`../JSON/userinfo.json`)
const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let options = ['rock', 'paper', 'scissors'],
    counters = ['paper', 'scissors', 'rock']

    if (!args[1]) {message.channel.send(`Type "rock", "paper", or "scissors" (or even "r", "p", or "s"!) after >rps to play.`); return false}

    options.forEach(option => {
        if (option.startsWith(args[1].toLowerCase()) && args[1] != "") args[1] = option
    })
    if (!options.includes(args[1])) return message.channel.send(`That's not "rock", "paper", or "scissors" is it?`)

    let computerChoice = options[modules.randomInt(0, options.length - 1)],
    string = `You throw ${capitalise(args[1])}. I throw...`,
    msg = await message.channel.send(string)
    await modules.delay(0.5)
    msg.edit(string += `\n${capitalise(computerChoice)}! `)
    await modules.delay(0.5)
 
    if (args[1] == computerChoice) {
        msg.edit(string += `\nOh.`)
        await modules.delay(0.5)
        return await msg.edit(string += `\nA draw.`)
    }
    else if (computerChoice == counters[options.indexOf(args[1])]) {
        return await msg.edit(string += `Yay!! I win!`)
    }
    else {
        money = modules.randomInt(0,50)
        msg.edit(string += `Damn..`)
        await modules.delay(0.5)
        msg.edit(string += `\nHere, have $${money}..`)
        modules.addMoney(message.author, money)
        return true
    }
}

module.exports.info = {
    name: `rps`,
    type: `fun`,
    usage: `<"rock", "paper" or "scissors">`,
    summary: `Play Rock, Paper, Scissors for Kuro monies.`,
    cooldown: 20000
}

const capitalise = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }