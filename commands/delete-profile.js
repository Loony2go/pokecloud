module.exports.command = {
    name: "delete-profile",
    aliases: ["dp"],
    category: "Profile",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/delete-profile",
        video: ""
    },
    description: "Deletes __YOUR__ profile from the PokeCloud database. Once a profile is deleted, it can not be recovered.",
    usage: "",
    example: "",
    permissions: {
        role: "any",
        channel: "any"
    },
}

const utilities = require("../home/utilities.json")

exports.run = (bot, message, args) => {

    let serverid = message.guild.id
    let userid = message.author.id
    let profile = bot.trainerProfile
    let guildSettings = bot.guildSettings

    let user = message.mentions.users.first() || message.author
    let nickname = message.guild.member(user).displayName


    // must be developer
    if (message.author.id !== "373660480532643861") {
        var developer = new Discord.RichEmbed()
            .setColor(utilities.colors.error)
            .setTitle("Only the developer can use this command")    
        return message.channel.send({embed: developer})
        .then(deleteIT => {
            deleteIT.delete(2000)
        });
    };

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/" + language.toLowerCase() + "/responses.json")

    if(profile.has(userid)) {
        profile.delete(userid)
        message.reply(`Your profile and all data associated with it has been deleted from the PokeCloud servers.`)
        bot.channels.get(utilities.channels.profile_log).send(`**${userid}** | (${nickname}) has deleted their profile from the database.`)
    } else {
        message.channel.send(`No profile found...`)
    };
};