const webshot = require('webshot');
let rand = require('../random_bot');
const Discord = require("discord.js");
const Imgur = require("imgur");
const fs = require("fs");

let sc = {};

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'screenshot', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;

            if (gId in sc){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Screenshot in progress.');
                message.channel.send({embed});
                return;
            }

            if (args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'screenshot (url)`');

                message.channel.send({embed});
            }else{
                let url = args[0];

                if (!rand.validateUrl(url)){
                    embed
                        .setColor(0xFF0000)
                        .addField("**__ERROR__**", 'Invalid URL given.`');

                    message.channel.send({embed});
                    return;
                }

                sc[gId] = true;

                webshot(url, __dirname + '/../Images/' + id + '.png', function(err) {
                    if (err){
                        embed
                            .setColor(0xFF0000)
                            .addField("**__ERROR__**", 'Something broke after downloading...\n My daddy will take a look at this.');
                        console.log(err);
                    } else{
                        Imgur.uploadFile(__dirname + '/../Images/' + id + '.png').then(function (json) {
                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0x00FF00)
                                .setImage(json.data.link)
                                .addField("**__SUCCESS__**  ✅", 'Here it is!');
                            message.channel.send({embed});

                            delete sc[gId];

                            setTimeout(()=> {
                                fs.unlink(__dirname + '/../Images/' + id + '.png',  (err) => {
                                    if (err) {
                                        console.log("failed to delete local image (screenshot): "+err);
                                    } else {
                                        console.log('successfully deleted local image (screenshot) ', __dirname + '/../Images/' + id + '.png');
                                    }
                                });
                            }, 10 * 1000);
                        }).catch(function (err) {
                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0xFF7F00)
                                .addField("**__UPLOAD ERROR__**", 'Something broke after uploading...');
                                message.channel.send({embed});
                            console.error(err.message);

                            delete sc[gId];
                        });
                    }
                })
            }
        });
    }
};