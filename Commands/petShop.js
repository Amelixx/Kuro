const { MessageEmbed } = require("discord.js"),
Pet = require("../Pet.js"),
fs = require(`fs`),
userinfo = require(`../JSON/userinfo.json`),
pets = require(`../JSON/pets.json`),
modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, content, prefix) => {
    if (!content) {
        let startingDesc = `Pet shop or whatever lol`

        let embed = new MessageEmbed()
            .setColor([10, 100, 200])
            .setTitle(`${bot.user.username} Pet Shop`)
            .setDescription(startingDesc)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)


        for (let x in pets) {
            let pet = pets[x], emoji = pet.defaultEmoji || ""

            embed.addField(emoji + x, `*${pet.description}*\n`)
        }

        message.channel.send({embed})
    }
    else if (args[1] == "buy") {
        let searchString = content.replace(`${args[1]} `, ``)
        let pet = modules.getPet(searchString, message.channel)
        if (pet === undefined) return;

        // Any special requirements for buying certain pets here


        let connective = `a`
        if (modules.vowels.includes(pet.toLowerCase())) connective = `an`

        if (Number(pets[pet].price) > userinfo[message.author.id].money) return message.channel.send(`You don't have enough money to buy ${connective} ${pet}. :c`)

        response = await modules.sendQuestion(message.author, message.channel, "name:", msg => /[a-z1-9]/.test(msg.content.toLowerCase()), 90000)
        if (!response) return;

        if (!userinfo[message.author.id].pets) userinfo[message.author.id].pets = {}
        else if (userinfo[message.author.id].pets[response.content]) return message.channel.send("You already own a pet of that name.");
        
        let newPet = new Pet({name: response.content, type: pet, owner: message.author})
        console.log(newPet)
        userinfo[message.author.id].pets[response.content] = newPet

        userinfo[message.author.id].money -= pets[pet].price
        fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))

        await message.channel.send(`Successfully bought ${connective} ${pet} for $${Number(pets[pet].price).toLocaleString()}! ${pets[pet].emoji || ""}`)
        
    }
}

module.exports.info = {
    name: `petshop`,
    aliases: [`pets`, `petmarket`],
    type: `economy`,
    summary: `Buy pets, and pet stuff.`,

    requiresUserinfo: true
}