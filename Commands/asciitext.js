let rand = require('../random_bot');
const Discord = require("discord.js");
const request = require("request");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'asciitext', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            if (args.length < 1){
                embed
                    .setColor(0x00A86B)
                    .addField('Error: ', 'Usage: ```' + rand.commandPrefix + 'ascii (text...)```');

                message.channel.send({embed});
            }else{
                request('http://artii.herokuapp.com/make?text=' + args.join(" "), function (error, response, html) {
                    if (!error && response.statusCode === 200) {
                        embed
                            .setColor(0x00A86B)
                            .addField('Response', html);

                        message.channel.send({embed});
                    } else if (response.statusCode === 500) {

                        embed
                            .setColor(0x00A86B)
                            .addField('Error: ', "```Request failed.```");

                        message.channel.send({embed});
                    }
                });
            }
        });
    }
};