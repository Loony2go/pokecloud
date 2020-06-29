module.exports.command = {
    name: "report-nest",
    aliases: ["rn"],
    category: "Nest Reporter",
    link: {
        docs: "https://pokecloud.gitbook.io/pokecloud/v/public/commands/report-nest",
        video: ""
    },
    description: "Report a Pokemon species nesting at a nest location created by the current community.",
    usage: "<nest name>, <pokemon>",
    example: "hilton park, pikachu",
    permissions: {
        role: "reporter or admin",
        channel: "any"
    },
}

const Discord = require("discord.js")
const color = require("../home/colors.json")
const image = require("../home/images.json")


exports.run = (bot, message, args) => {

    // assign key shortcuts
    let guildSettings = bot.guildSettings
    let dex = bot.goPokedex
    let nest = bot.defaultNest

    // assign id shortcuts
    let serverid = message.guild.id
    let current_channel = message.channel.id

    // get language & correct responses
    let language = guildSettings.get(serverid, "server.language")
    const respon = require("../home/languages/" + language.toLowerCase() + ".json")

    // get & check for reporter & admin roles
    let reporterrole = guildSettings.get(serverid, 'roles.reporter')
    let adminrole = guildSettings.get(serverid, 'roles.admin')
    if (!message.member.roles.some(r => r.id === reporterrole) && !message.member.roles.some(r => r.id === adminrole)) {
        let reporterRoleCheck = require(`../home/embeds/reporterRoleCheck`);
        return reporterRoleCheck.run(bot, message);
    };

    // ensure nest & specie name is provided
    if(!args[0] && !args[1]) {
        var embed = new Discord.RichEmbed()
            .setTitle(respon.titles.error)
            .setColor(color.error)
            .setDescription(`You must provide the nest name & species`)
            .addField("Example", `${this.command.aliases} ${this.command.example}`)
        return message.channel.send({embed: embed})
    };



    // organize args
    let output = args.join(" ").trim().split(",")
    // capitalize function
    function capitalize_Words(output) {
        return output.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };



    // generate nest key
    let nestName = capitalize_Words(output[0])
    let nestKey = `${message.guild.id}-${nestName}`

    // ensure nest exists
    if(!nest.has(nestKey)) {
        
        // nest not found, search for alias
        let aliasSearch = nest.filter(n => n.name.alias === nestName);
        let aliasServerSearch = aliasSearch.filter(n => n.serverid === serverid)
        let nestAliasMap = aliasServerSearch.map(n => [`${n.serverid}-${n.name.default}`])
        let nestAlias = nestAliasMap.toString()

        // check how many nests were found
        // under construction

        // nest alias found
        if(nest.has(nestAlias)) {
            nestKey = nestAlias
        } else { // nest does not exist
            var embed = new Discord.RichEmbed()
                .setColor(color.error)
                .setAuthor(respon.titles.error)
                .setDescription(`**${nestName}** ${respon.deny.nestDontExist}`)
            return message.channel.send({embed: embed});
        };
    };







    

    // assign species arg
    var nestPokemon = capitalize_Words(output[1]).trim()
    var nestPokemonLow = output[1].trim().toLowerCase()

    // ensure species exisits, if not search for the key using current servers language settings
    if(!dex.has(nestPokemon)) {

        let nestPokemonNonEnglish = dex.findKey(p => p.name[language.toLowerCase()] === nestPokemon);
        
        // species not found
        if(nestPokemonNonEnglish == null) {
            // pokemon not in the dex
            var embed = new Discord.RichEmbed()
                .setAuthor(respon.titles.error)
                .setColor(color.error)
                .setDescription(`${respon.args.validPokemon}`)
                .setFooter(respon.auto_delete.a, image.warning)
            return message.channel.send({embed: embed}).then(msg => {
                setTimeout(function(){ 
                    message.delete()
                    msg.delete()
                }, 60000);
            });
        };
        
        // species found & assigned
        var nestPokemon = nestPokemonNonEnglish
        var nestPokemonLow = nestPokemonNonEnglish.toLowerCase();
    };

    
    // ensure nest is created by the current server
    let nestserverid = nest.get(nestKey, 'serverid')
    if(nestserverid === serverid) {












        // unreport the nest
        if(nestPokemon === `?`) {
            // generate new embed
            const embed_unconfirm = new Discord.RichEmbed()

            // save unreported name & image
            nest.set(nestKey, `?`, 'pokemon.current.name')
            nest.set(nestKey, `https://github.com/MrRecordHolder/pokecloud/blob/master/images/emojis/spawn.png?raw=true`, `pokemon.current.image`)

            // RESPONSE MESSAGE
            embed_unconfirm.setThumbnail(pokemonImg)
            embed_unconfirm.setColor(color.caution)
            embed_unconfirm.setAuthor(respon.titles.caution)
            embed_unconfirm.setDescription(`**${nestPokemon}** has been reported at **${nestName}**\n*This nest is not listed in any channels, so no message was updated. Reported data was saved.*`)
            embed_unconfirm.setThumbnail(pokemonImg)
            return message.channel.send(embed_unconfirm)
        };















        // ensure species can nest
        let nestable = dex.get(nestPokemon, 'nest')
        if(nestable === true) {

            // get reported species data
            let messageid = nest.get(nestKey, 'messageid')
            let dexNumber = dex.get(nestPokemon, "dex")
            let dexPrimaryType = dex.get(nestPokemon, "type.primary")
            let ptypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexPrimaryType}_pc`);
            let dexSecondaryType = dex.get(nestPokemon, "type.secondary")
            let stypeEmoji = bot.emojis.find(emoji => emoji.name == `${dexSecondaryType}_pc`);
            let dexPrimaryBoost = dex.get(nestPokemon, "boost.primary")
            let pboostEmoji = bot.emojis.find(emoji => emoji.name == `${dexPrimaryBoost}_pc`);
            let dexSecondaryBoost = dex.get(nestPokemon, "boost.secondary")
            let sboostEmoji = bot.emojis.find(emoji => emoji.name == `${dexSecondaryBoost}_pc`);
            let dexShiny = dex.get(nestPokemon, "shiny.wild")
            let shinyEmoji = bot.emojis.find(emoji => emoji.name == `shiny_pc`);   
            
            // get other needed data
            let nestchannel = nest.get(nestKey, 'channelid')









            



            // get current servers timezone
            if(guildSettings.has(serverid, 'server.timezone')) {
                var timezone = guildSettings.get(serverid, 'server.timezone')
            } 
            // no timezone found, set to -4 by default
            else {
                guildSettings.set(serverid, '-4', 'server.timezone')
                var timezone = guildSettings.get(serverid, 'server.timezone')
            }

            // generate new date
            const today = new Date();

            // calculate + or - properly
            if(timezone.startsWith('+')) {
                var today_local = new Date(today.toLocaleString("en-US", {timeZone: `Etc/GMT${timezone.replace("+","-")}`}));
            } else if(timezone.startsWith('-')) {
                var today_local = new Date(today.toLocaleString("en-US", {timeZone: `Etc/GMT${timezone.replace("-","+")}`}));
            } else if(timezone.startsWith('0')) {
                var today_local = new Date(today.toLocaleString("en-US", {timeZone: `GMT`}));
            };

            // save new date
            nest.set(nestKey, today_local.getDate(), 'lastReport.day')
            nest.set(nestKey, today_local.getMonth(), 'lastReport.month')
            nest.set(nestKey, today_local.getFullYear(), 'lastReport.year')

            // format date
            let hours = (today_local.getHours());
            if(hours==0){
                hours=12;
            }
            else if(hours>12) {
                hours=hours%12;
            };
            let minutes = today_local.getMinutes();
            let ampm = today_local.getHours() > 11 ? "PM":"AM";
            let addzero = minutes < 9 ? "0":""
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            let formatted_date = days[today_local.getDay()] + " " + months[today_local.getMonth()] + ", " + today_local.getDate() + " at " + hours + ":" + addzero + today_local.getMinutes() + " " + ampm

            

            if(nestchannel === "") {
                // generate new embed
                const embed_confirm = new Discord.RichEmbed()

                // save species name
                nest.set(nestKey, nestPokemon, 'pokemon.current.name')

                if(dexShiny === true) { // if the species can be found shiny in the wild
                    pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}-shiny@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                    embed_confirm.setThumbnail(pokemonImg)
                } else { // if the species can not be found shiny in the wild
                    pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                };

                // RESPONSE MESSAGE
                embed_confirm.setThumbnail(pokemonImg)
                embed_confirm.setColor(color.caution)
                embed_confirm.setAuthor(respon.titles.caution)
                embed_confirm.setDescription(`**${nestPokemon}** has been reported at **${nestName}**\n*This nest is not listed in any channels, so no message was updated. Reported data was saved.*`)
                embed_confirm.setThumbnail(pokemonImg)
                return message.channel.send(embed_confirm)
            };


            // attempt to edit embed
            bot.channels.get(nestchannel).fetchMessage(messageid).then(editEmbed => {
                
                // intilize embed edit
                const { RichEmbed } = require ('discord.js');
                const embed = new RichEmbed (editEmbed.embeds[0])

                // clear previous fields
                embed.fields.length = 0

                // set color to match species type
                if(capitalize_Words(dexPrimaryType) === "Normal") {
                    embed.setColor('CCD081')
                }
                if(capitalize_Words(dexPrimaryType) === "Fighting") {
                    embed.setColor('AE4F3C')
                }
                if(capitalize_Words(dexPrimaryType) === "Psychic") {
                    embed.setColor('D47FB3')
                }
                if(capitalize_Words(dexPrimaryType) === "Dragon") {
                    embed.setColor('494788')
                }
                if(capitalize_Words(dexPrimaryType) === "Water") {
                    embed.setColor('6DA0D0')
                }
                if(capitalize_Words(dexPrimaryType) === "Fairy") {
                    embed.setColor('FFC3D2')
                }
                if(capitalize_Words(dexPrimaryType) === "Ice") {
                    embed.setColor('BDEAF5')
                }
                if(capitalize_Words(dexPrimaryType) === "Flying") {
                    embed.setColor('C8AFD8')
                }
                if(capitalize_Words(dexPrimaryType) === "Ghost") {
                    embed.setColor('7F6193')
                }
                if(capitalize_Words(dexPrimaryType) === "Fire") {
                    embed.setColor('FF9051')
                }
                if(capitalize_Words(dexPrimaryType) === "Steel") {
                    embed.setColor('CECECE')
                }
                if(capitalize_Words(dexPrimaryType) === "Grass") {
                    embed.setColor('79CB7B')
                }
                if(capitalize_Words(dexPrimaryType) === "Ground") {
                    embed.setColor('DEE1A6')
                }
                if(capitalize_Words(dexPrimaryType) === "Rock") {
                    embed.setColor('AAAC72')
                }
                if(capitalize_Words(dexPrimaryType) === "Dark") {
                    embed.setColor('6F635B')
                }
                if(capitalize_Words(dexPrimaryType) === "Electric") {
                    embed.setColor('EEFC46')
                }
                if(capitalize_Words(dexPrimaryType) === "Poison") {
                    embed.setColor('7A5289')
                }
                if(capitalize_Words(dexPrimaryType) === "Bug") {
                    embed.setColor('B1C858')
                }

                // save species name
                nest.set(nestKey, nestPokemon, 'pokemon.current.name')

                // if the species can be found shiny in the wild
                if(dexShiny === true) {
                    // get, save, paste species image
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}-shiny@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                    embed.setThumbnail(pokemonImg)

                    // generate species data
                    if(dexSecondaryType === "") {
                        embed.addField(`#${dexNumber} **${nestPokemon}** ${shinyEmoji}`,`Type: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)}\nBoost: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)}`)
                    } 
                    else {
                        embed.addField(`#${dexNumber} **${nestPokemon}** ${shinyEmoji}`,`Types: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)} ${stypeEmoji} ${capitalize_Words(dexSecondaryType)}\nBoosts: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)} ${sboostEmoji} ${capitalize_Words(dexSecondaryBoost)}`)
                    };

                } else { // if the species can not be found shiny in the wild
                    // get, save, paste species image
                    var pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                    embed.setThumbnail(pokemonImg)
                    
                    // generate species data
                    if(dexSecondaryType === "") {
                        embed.addField(`#${dexNumber} **${nestPokemon}**`,`Type: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)}\nBoost: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)}`)
                    }
                    else {
                        embed.addField(`#${dexNumber} **${nestPokemon}**`,`Types: ${ptypeEmoji} ${capitalize_Words(dexPrimaryType)} ${stypeEmoji} ${capitalize_Words(dexSecondaryType)}\nBoosts: ${pboostEmoji} ${capitalize_Words(dexPrimaryBoost)} ${sboostEmoji} ${capitalize_Words(dexSecondaryBoost)}`)
                    };
                };

                // display reported data
                embed.setFooter(`Reported ${formatted_date}`)
                // finish editing the embed
                editEmbed.edit(embed);

                // generate discord memssage link
                let Discord_message_link = `https://discordapp.com/channels/${serverid}/${nestchannel}/${messageid}`

                // RESPONSE MESSAGE
                const embed_confirm = new Discord.RichEmbed()
                    embed_confirm.setColor(color.success)
                    embed_confirm.setAuthor(respon.titles.success)
                    embed_confirm.setDescription(`**${nestPokemon}** has been reported at **${nestName}**\n[**Click here to view the nest**](${Discord_message_link})`)
                    embed_confirm.setThumbnail(pokemonImg)
                    if(current_channel === nestchannel) {
                        embed_confirm.setFooter(respon.auto_delete.a, image.warning)
                    };
                message.channel.send(embed_confirm).then(msg => {
                    if(current_channel === nestchannel) {
                        setTimeout(function(){ 
                            message.delete()
                            msg.delete()
                        }, 60000);
                    };
                });
            }).catch(errors => { // embed message not found
                // generate new embed
                const embed_confirm = new Discord.RichEmbed()

                // save species name
                nest.set(nestKey, nestPokemon, 'pokemon.current.name')

                if(dexShiny === true) { // if the species can be found shiny in the wild
                    pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}-shiny@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                    embed_confirm.setThumbnail(pokemonImg)
                } else { // if the species can not be found shiny in the wild
                    pokemonImg = `https://github.com/MrRecordHolder/pokecloud/blob/master/images/pokemon/${dexNumber}-${nestPokemonLow}@3x.png?raw=true`
                    nest.set(nestKey, pokemonImg, 'pokemon.current.image')
                };

                // RESPONSE MESSAGE
                embed_confirm.setThumbnail(pokemonImg)
                embed_confirm.setColor(color.caution)
                embed_confirm.setAuthor(respon.titles.caution)
                embed_confirm.setDescription(`**${nestPokemon}** has been reported at **${nestName}**\n*This nest is not listed in any channels, so no message was updated. Reported data was saved.*`)
                embed_confirm.setThumbnail(pokemonImg)
                return message.channel.send(embed_confirm)
            });
        } else { // species can not nest
            var embed = new Discord.RichEmbed()
                .setAuthor(respon.titles.error)
                .setColor(color.error)
                .setDescription(`${nestPokemon} ${respon.deny.pokemonNestFalse}`)
                .setFooter(respon.auto_delete.a, image.warning)
            return message.channel.send({embed: embed}).then(msg => {
                setTimeout(function(){ 
                    message.delete()
                    msg.delete()
                }, 60000);
            });
        };
        
    };
};