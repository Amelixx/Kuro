const main = require(`./Kuro.js`),
bot = main.bot,
modules = require(`./modules.js`)
userStats = require(`./JSON/Stats/userStats.json`)
let userinfo = require(`./JSON/userinfo.json`)

module.exports = {
    // -- Shameless Self Promotion --
    "Devoted Fan": {
        description: "Invite all of Rubix's bots to your server. (Kuro, Corona News, Warbot)",
        check: (u) => {
            return bot.guilds.cache.find(g => {return g.ownerID == u.id && g.members.cache.has("690024532853129292") && g.members.cache.has(`565175024143564840`)}) != undefined
        },
        progress: (u) => {
            if (bot.guilds.cache.find(g => g.ownerID == u.id && g.members.cache.has("690024532853129292"))) return 2
            else if (bot.guilds.cache.find(g => g.ownerID == u.id && g.members.cache.has("565175024143564840"))) return 2
            else if (bot.guilds.cache.find(g => g.ownerID == u.id)) return 1
            else return 0
        },
        goal: 3,
        rarity: `Silver`,
    },
    "Avid Kuro Fan": {
        description: "Own at least 5 servers with Kuro.",
        check: (u) => {
            return bot.guilds.cache.filter(g => {return g.ownerID == u.id}).size >= 5
        },
        progress: (u) => {
            return bot.guilds.cache.filter(g => {return g.ownerID == u.id}).size
        },
        goal: 5,
        rarity: `Platinum`,
        removeable: true
    },
    "This is where the development happens.. 👀": {
        description: "Visit the community at the Rubìx Bot Hub.",
        check: async (u) => {
            let member = await bot.guilds.cache.get(`689734320784408667`).members.cache.get(u.id)
            if (member) return true
            else return false
        },
        rarity: `Bronze`,
        removeable: true
    },
    "You voted!": {
        description: "Vote for Kuro on Discord Bot List!",
        check: (u) => {
            return userStats[u.id] && userStats[u.id].votes > 1;
        },
        rarity: `Bronze`
    },
    "20 Votes!": {
        description: "Vote for Kuro on Discord Bot List at least 20 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id].votes >= 20;
        },
        progress: (u) => { return userStats[u.id].votes || 0 },
        goal: 20,
        rarity: `Gold`
    },
    "50 Votes!": {
        description: "Vote for Kuro on Discord Bot List at least 50 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id].votes >= 50;
        },
        progress: (u) => { return userStats[u.id].votes || 0 },
        goal: 50,
        rarity: `Platinum`
    },

    // -- Marriage --
    "'Till Death Do Us Part..": {
        // Marry someone
        description: "Find true love.",
        emoji: "💖",
        check: (u) => {
            return userinfo[u.id].marriagePartner && bot.users.cache.get(userinfo[u.id].marriagePartner)
        },
        rarity: `Bronze`
    },
    "Heartbreaker": {
        // Divorce someone
        description: "Break your ex-partner's heart.",
        emoji: "💔",
        rarity: `Bronze`
    },
    "Heartbreak": {
        // Get divorced
        description: "Your partner called for divorce..",
        emoji: "💔",
        rarity: `Bronze`
    },
    "Botophile": {
        // Marry a bot
        description: "Either you're lonely, or you really like discord bots.",
        emoji: "🤖",
        check: (u) => {
            if (userinfo[u.id].marriagePartner) {
                let partner = bot.users.cache.get(userinfo[u.id].marriagePartner)
                return partner && partner.bot
            }
            else return false
        },
        rarity: `Bronze`
    },
    "Can I marry myself??": {
        description: "I was forced to make this a feature.",
        check: (u) => {
            return userinfo[u.id].marriagePartner && userinfo[u.id].marriagePartner == u.id
        },
        rarity: `Bronze`
    },

    // -- Economy --
    "That shouldn't be possible..": {
        description: "Somehow acquire exactly $0.5..",
        emoji: "💸",
        check: (u) => {
            return userinfo[u.id].money == 0.5
        },
        rarity: `Silver`
    },
    "Ooo, shiny!": {
        // Dig up a diamond, not necessarily have one
        description: "Find the rarest item on Kuro.",
        emoji: "💎",
        rarity: `Gold`
    },
    "Hoarder": {
        description: "Have over 100 items in your inventory.",
        check: (u) => {
            if (Object.values(userinfo[u.id].inventory).length == 0) return false
            return Object.values(userinfo[u.id].inventory).reduce((a,b) => {return a + b}) > 100;
        },
        progress: (u) => { return Object.values(userinfo[u.id].inventory).reduce((a,b) => {return a + b}) || 0},
        goal: 100,
        rarity: `Silver`
    },
    "Certified Millionaire": {
        description: `Have at least $1 million.`,
        check: (u) => {
            userinfo[u.id].money >= 1000000
        },
        progress: (u) => { return userinfo[u.id].money || 0 },
        goal: 1000000,
        rarity: `Platinum`
    },
    "One of the Richest": {
        description: "Maintain a place on the front page of the money leaderboard.",
        check: (u) => {
            return modules.getLeaderboardArray().slice(0,10).includes(u.id);
        },
        rarity: `Platinum`,
        removeable: true
    },
    "They're not really fish.. but..": {
        description: "Obtain a golden fishing rod, a magical tool capable of fishing for organisms that aren't fish.",
        check: (u) => {
            return userinfo[u.id].inventory["Golden Fishing Rod"]
        },
        rarity: `Silver`
    },
    "Whale of a Time": {
        description: "Find a whale while fishing.",
        rarity: `Gold`
    },
    // !! Gather more than 5,000 or something from >market sell all

    // -- Command Usage --
    "Bad Thief": {
        description: "Be unsuccessful at stealing from people over 100 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id].failedRobs > 100
        },
        progress: (u) => {return userStats[u.id].failedRobs || 0},
        goal: 100,
        rarity: `Gold`
    },
    "Stealth 100": {
        description: "Manage to steal money from people over 100 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id].successfulRobs > 100
        },
        progress: (u) => {return userStats[u.id].successfulRobs || 0},
        goal: 100,
        rarity: `Gold`
    },

    "Command Spammer": {
        description: "Use over 1000 commands.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].total > 1000
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].total},
        goal: 1000,
        rarity: `Gold`
    },
    "You're an Addict..": {
        description: "Use over 5000 commands.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].total > 5000
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].total},
        goal: 5000,
        rarity: `Platinum`
    },

    "Expert Fisher": {
        description: "Use >fish over 100 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].fish && userStats[u.id]["Command Usage"].fish > 100
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].fish},
        goal: 100,
        rarity: `Gold`
    },
    "Fishing Day and Night...": {
        description: "Use >fish over 500 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].fish && userStats[u.id]["Command Usage"].fish > 500
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].fish},
        goal: 500,
        rarity: `Platinum`
    },
    "Expert Miner": {
        description: "Use >dig over 100 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].dig && userStats[u.id]["Command Usage"].dig > 100 
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].dig},
        goal: 100,
        rarity: `Gold`
    },
    "This isn't Minecraft you know..": {
        description: "Use >dig over 500 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].dig && userStats[u.id]["Command Usage"].dig > 500 
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].dig},
        goal: 500,
        rarity: `Platinum`
    },
    "Pickpocket": {
        description: "Use >rob over 100 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].rob && userStats[u.id]["Command Usage"].rob > 100 
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].rob},
        goal: 100,
        rarity: `Gold`
    },
    "Criminal Mastermind": {
        description: "Use >rob over 500 times.",
        check: (u) => {
            return userStats[u.id] && userStats[u.id]["Command Usage"].rob && userStats[u.id]["Command Usage"].rob > 500 
        },
        progress: (u) => {return userStats[u.id]["Command Usage"].rob},
        goal: 500,
        rarity: `Platinum`
    }
}