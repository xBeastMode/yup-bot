let rand = require('../random_bot');
const Discord = require("discord.js");
const request = require("request");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'query', [], (args, message) => {
            const embed = new Discord.RichEmbed();

            if (args.length >= 0){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__MAINTENANCE__**", 'This command is currently unavailable, updates are being done.');
                message.channel.send({embed});

                return;
            }

            if(args.length < 2) {
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'query (address) (port)`');
                message.channel.send({embed});

                return;
            }

            let address = args[0];
            let port = parseInt(args[1]);

            if (isNaN(port)){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__ERROR__**", 'Provide a numerical port.');

                message.channel.send({embed});

                return;
            }

            let url = 'https://use.gameapis.net/mcpe/query/extensive/' + address + ':' + port;
            request(url, function (error, response, html) {
                if (!error && response.statusCode === 200) {
                    let data = JSON.parse(html);

                    if (data.status) {
                        embed
                            .setColor(0x00FF00)
                            .addField('**__Join IP and PORT__**', address + ":" + port, true)
                            .addField('**__Protocol__**', '' + data.protocol + '', true)
                            .addField('**__Version__**', '' + data.version + '', true)
                            .addField('**__Software__**', '' + data.software + '', true)
                            .addField('**__MOTD__**', '' + data.motd + '', true)
                            .addField('**__Lobby__**', '' + data.map + '', true)
                            .addField('**__Players__**', '' + data.players.online + '/' + data.players.max + '', true)
                            .addField('**__List__**', '' + data.list === null || data.list === false ? 'none' : data.list + '', true)
                            .addField('**__Plugins__**', '' + data.plugins === null || data.plugins === false ? 'none' : data.plugins + '', true);

                        message.channel.send({embed});
                    } else {
                        embed
                            .setColor(0xFF0000)
                            .addField("**__ERROR__**", 'Server offline.```');
                    }
                } else if (response.body === undefined || response.body === 500) {
                    embed
                        .setColor(0xFF0000)
                        .addField("**__ERROR__**", 'Request failed.```');
                } else {
                    embed
                        .setColor(0xFF0000)
                        .addField("**__ERROR__**", 'Request failed.```');
                }
            });
        });
    }
};