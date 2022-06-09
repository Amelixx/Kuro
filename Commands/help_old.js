const Discord = require(`discord.js`);

const main = require(`../Kuro.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) {
        let helpString = new String("```css\n" + 
        "[Commands List]\n" + 
        `The default prefix is [>], the prefix here is [${prefix}], to find the server's prefix, mention kuro, type "help", and look here.\n` + 
        `For more details into a specific command, use [${prefix}help (command name)]\n\nPlease be aware this is a deprecated version of Kuro's help command and will likely not be modified. The command updates with new commands automatically. To use Kuro's newer help command, type ${prefix}config newhelp.\n\n`)

        let infoCommands = String(`[Infomation]\n`); let funCommands = new String(`[Fun]\n`)
        let moneyCommands = new String(`[Bot Economy]\n`); let adminCommmands = new String(`[Admin]\n`)
        let configCommands = `[Configuration]\n`
        main.botCommands.forEach(async command => {
            if (command.info.developer || command.info.noHelp) return;

            if (command.info.aliases) {
                aliases = new String(`\n  .Aliases - `)

                for (alias in command.info.aliases) aliases = aliases + `#${command.info.aliases[alias]} `
            }
            else aliases = String()

            if (command.info.subCommands) {
                subCommands = new String(`\n .SubCommands - `)

                for (let subCommand in command.info.subCommands) subCommands = subCommands + `#${command.info.subCommands[subCommand]} `
            }
            else subCommands = String()

            switch(command.info.type) {
                case `info`: infoCommands += `#${command.info.name} - ${command.info.summary}${aliases}${subCommands}\n`; break;
                case `fun`: funCommands += `#${command.info.name} - ${command.info.summary}${aliases}${subCommands}\n`; break;
                case `money`: moneyCommands += `#${command.info.name} - ${command.info.summary}${aliases}${subCommands}\n`; break;
                case `admin`: adminCommmands += `#${command.info.name} - ${command.info.summary}${aliases}${subCommands}\n`; break;
                case `config`: configCommands += `#${command.info.name} - ${command.info.summary}${aliases}${subCommands}\n`; break;
            }
        }) 
        await message.channel.send(`${helpString}\n${infoCommands}\n${funCommands}\`\`\``)
        await message.channel.send(`\`\`\`css\n${moneyCommands}\n${adminCommmands}\n${configCommands}\`\`\``)
    }
    else {
        let command = main.botCommands.get(args[1])
        if (!command) return message.channel.send(`Couldn't find a command matching '${args[1]}'`)
        else if (!command.info.help) return message.channel.send(`There is no help for this command; if you think there should be, suggest it on Kuro's server.`)
        
        let help = command.info.help

        while (help.includes(`%PREFIX%`)) help = help.replace(`%PREFIX%`, prefix)

        await message.channel.send(`__**Help for '${command.info.name}' command**__\n${help}`)
    }
}

module.exports.info = {
    name: `help_old`,
    ignore: true
}