const Discord = require(`discord.js`);

const modules = require(`../Modules.js`)
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) return message.channel.send(`Usage: \`>${this.info.usage}\`\nParameters in "<>" are required.\nParameters in "()" are optional.`)

    let userToTransfer;
    userToTransfer = modules.getMember(message.guild, args[1], message.channel)
    if (!userToTransfer) return;

    let name = userToTransfer.displayName
    userToTransfer = userToTransfer.user
    if (userToTransfer.bot) return message.channel.send(`You cannot give items to bots.`)

    let arg = await coreMessage.split(" ").splice(2).join(" ")
    let amount = Number(args[2])
    if (isNaN(amount)) {arg = await coreMessage.replace(`${args[1]} `, ``); amount = 1}

    let itemToTransfer;

    if (!arg) return message.channel.send(`Usage: \`>${this.info.usage}\`\nParameters in "<>" are required.\nParameters in "()" are optional.`)

    console.log(arg)

    if (arg.toLowerCase() == `fish`) itemToTransfer = `Fish`
    else if (`tropical fish`.startsWith(arg.toLowerCase())) itemToTransfer = "Tropical Fish"
    else if (`blowfish`.startsWith(arg.toLowerCase())) itemToTransfer = "Blowfish"
    else {itemToTransfer = await modules.getMarketItem(arg.toLowerCase(), true)}

    if (!itemToTransfer) return message.channel.send(`I couldn't find an item matching \`${arg}\``)

    if (String(amount).startsWith(`0`) || Number(amount) < 1) return message.channel.send(`Invalid amount.`)

    if (amount > 1) {s = "s"; connective = amount}
    else {
        s = "", connective = "a"
        if (modules.vowels.includes(itemToTransfer[0])) connective = "an"
    }

    if (userToTransfer == message.author) return message.channel.send(`:confetti_ball: Wow, you just transferred ${connective} ${itemToTransfer}${s} to yourself! Surprisingly, it didn't really have an effect. :thinking:`)
    if (!userinfo[message.author.id].inventory[itemToTransfer] || amount > userinfo[message.author.id].inventory[itemToTransfer]) return message.channel.send(`You don't have enough of that item to give.`)

    await modules.removeFromInventory(message.author, itemToTransfer, amount)
    await modules.addToInventory(userToTransfer, itemToTransfer, amount)

    message.channel.send(`Successfully transferred ${connective} ${itemToTransfer}${s} to **${name}**!`)
}

module.exports.info = {
    name: `itemtransfer`,
    type: `economy`,
    summary: `Transfers items from one user to another.`,

    aliases: ["transferitem", "give"],
    usage: `itemtransfer <Member> (amount) <Item>`,

    requiresUserinfo: true
}