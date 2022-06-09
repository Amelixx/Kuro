const pets = require(`./JSON/pets.json`);

/**
 * @class Represents a cute, fluffy pet that you can care and nurture for.
 */
class Pet {
    /**
     * @constructor
     * @param {object} data {name?, type, hunger?, play?, health?, level?, xp?, parents?, children?, fertility?}
     */
    constructor(data) {
        this.name = data.name || "An unnamed pet. :("
        this.type = data.type
        this.owner = data.owner

        let d = pets[this.type] // Default data, couldn't think of a better variable name lol

        this.defaultEmoji = d.defaultEmoji || ""

        this.maxHunger = d.maxHunger
        this.hunger = data.hunger || this.maxHunger

        this.maxPlay = d.maxPlay
        this.play = data.play || this.maxPlay

        this.maxHealth = d.maxHealth
        this.health = data.health || this.maxHealth
        this.healthLossRate = d.healthLossRate

        // Hygiene?

        this.level = data.level || 0
        this.xp = data.xp || 0

        this.parents = data.parents || null
        this.children = data.children || null

        this.fertility = data.fertility || 25
    }

    /**
     * Kill the pet lol
     */
    die() {

    }
}

module.exports = Pet