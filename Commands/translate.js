let rand = require('../random_bot');
const Discord = require("discord.js");
const ISO6391 = require('iso-639-1');
const Translate = require('google-translate-api');

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'translate', ['traducir'], (args, message) => {
            const embed = new Discord.RichEmbed();

            if (args.length < 2) {
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'translate (to language) (text...`');

                message.channel.send({embed});

                return;
            }

            let to = args.shift();
            const text = args.join(" ");

            if (!ISO6391.validate(to)) {
                if (!ISO6391.validate(ISO6391.getCode(to))) {
                    embed
                        .setColor(0xFF0000)
                        .addField("**__ERROR__**", 'Enter a valid language.\nUsage: `' + rand.commandPrefix + 'translate (to language) (text...`');
                    message.channel.send({embed});

                    return;
                } else {
                    to = ISO6391.getCode(to);
                }
            }

            const start = Date.now();
            Translate(text, {to: to})
                .then(res => {

                    const now = Math.round(Date.now() - start);

                    embed
                        .setColor(0x00FF00)
                        .addField('**__ORIGINAL__**', text)
                        .addField('**__TRANSLATION__**', res.text)
                        .setFooter('Timestamp is ' + now + ' milliseconds');

                    message.channel.send({embed});
                }).catch(err => {
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Sorry, an error occurred while translating');

                message.channel.send({embed});
                console.error('Error: ' + err);
            });
        });
    }
};