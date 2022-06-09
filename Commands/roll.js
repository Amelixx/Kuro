const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    thing = "dice"
    if (!args[1]) sides = 6
    else if (!Number.isInteger(Number(args[1]))) return message.channel.send(`'${args[1]}' is not an integer.`)
    else sides = args[1]

    if (!args[2]) amount = 1, thing = "die"
    else if (!Number.isInteger(Number(args[2]))) return message.channel.send(`'${args[2]}' is not an integer.`)
    else amount = args[2]

    let values = "",
    total = 0
    for (let i=0; i < amount; i++) {
        let roll = modules.randomInt(1, sides)
        values += `\`${roll}\` `
        total += roll
    }

    s = "s", combined = ""
    if (sides == 1) s = ""

    if (amount > 1) combined = `Combined total: ${total.toLocaleString()}`

    message.channel.send(`🎲 Roll (${amount} ${thing}, ${sides} side${s})\n${values}\n${combined}`)
}

module.exports.info = {
    name: `roll`,
    type: `fun`,
    summary: `Roll a set number of set sided die. (Default is 6 sided)`,
    usage: `(sides) (number of dice)`,

    aliases: [`dice`]
}