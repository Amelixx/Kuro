const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage) => {
    if (message.deletable) message.delete()
    let messageToSend = ''
    let characterToAdd = ''
    let addcharacter = true
    let bannedCharacters = [`,`,`'`,`-`,`_`,`>`,`<`,`(`,`)`,`{`,`}`,`@`,`~`,`/`,`[`,`]`,`;`,`:`,`/`,`\\`]
    let numbers = [`zero`,`one`,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`]
    let count = 0
    while (coreMessage[count] != null) {
        if (coreMessage[count] == ' ') characterToAdd = `       `
        else if (coreMessage[count] == `*`) characterToAdd = `:asterisk:`
        else if (coreMessage[count] == `#`) characterToAdd = ':hash:'
        else if (coreMessage[count] == `+`||coreMessage[count] == `-`||coreMessage[count] == `/`||coreMessage[count] == `=`) characterToAdd = coreMessage[count]
        else if (coreMessage[count] == '.') characterToAdd = `:black_small_square:`
        else if (coreMessage[count] == '?') characterToAdd = `:question:`
        else if (coreMessage[count] == '!') characterToAdd = `:exclamation:`  
        else if (coreMessage[count] == `:` && coreMessage[count + 1] == `)`) characterToAdd = `:)`
        else if (bannedCharacters.includes(coreMessage[count])) addcharacter = false
        else if (!isNaN(coreMessage[count])) characterToAdd = `:${numbers[coreMessage[count]]}:`
        else characterToAdd = `:regional_indicator_`+coreMessage[count].toLowerCase()+`:`
        
        count = count + 1
        if (addcharacter = true) messageToSend = messageToSend + characterToAdd
        addcharacter = true
    }
    message.channel.send(messageToSend)
}

module.exports.info = {
    name: `blocktext`,
    type: `fun`,
    summary: `Turns a chunk of text into emoji blocks...`
}