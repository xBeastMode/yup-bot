let rand = require('../random_bot');
const Discord = require("discord.js");
const Jimp  = require("jimp");
const imgur = require("imgur");
const probe = require('probe-image-size');
const download = require('image-downloader');
const fs = require("fs");

module.exports = {
    init: function () {
        imgur.setClientId("abb374bc4ebb61b");
        rand.registerCommand(rand.commandPrefix, 'blur', [], (args, message) => {
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;
            let embed = new Discord.RichEmbed();
            if (args.length < 2){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: \n`' + rand.commandPrefix + 'blur (url | @user) (percent)`');

                message.channel.send({embed});
                return;
            }

            if (isNaN(args[1])){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", '**Invalid percentage.**\n**Usage**: *`' + rand.commandPrefix + 'blur (url | @user) (percent)`*');

                message.channel.send({embed});
                return;
            }

            if (Number(args[1]) > 100 || Number(args[1]) < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", '**Invalid percentage.**\n*Percentage must go from 1-100.*');
                message.channel.send({embed});
                return;
            }

            if (gId in rand.process){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Blur is only allowed every 30 seconds\nbecause it takes a lot of processing power and bandwidth.');
                message.channel.send({embed});
                return;
            }

            embed
                .setColor(0x007FFF)
                .addField("**__PROGRESS__**", 'Working... This may take a while...');

            let URL = args[0];
            let contrast = Number(args[1]);

            const mentions = message.mentions.members;
            if (mentions !== null && mentions.array().length > 0){
                rand.Bot.fetchUser(mentions.array()[0].id).then(myUser => {
                    URL = myUser.avatarURL;
                    URL = URL.substring(0, URL.length - 10);
                });

            }

            delete rand.process[gId];

            message.channel.send({embed}).then(m => {
                //
                // Image dimensions
                //
                probe(URL, function (err, result) {
                    if (result.type === undefined){
                        embed = new Discord.RichEmbed();

                        embed
                            .setColor(0xFF7F00)
                            .addField("**__UNSUPPORTED__**", 'Only `PNG, JPG, JPEG` are supported.');

                        m.edit(embed);
                        delete rand.process[gId];
                        return;
                    }else if (result.type !== 'png' && result.type !== 'jpg' && result.type !== 'jpeg'){
                        embed = new Discord.RichEmbed();

                        embed
                            .setColor(0xFF7F00)
                            .addField("**__UNSUPPORTED__**", 'Only `PNG, JPG, JPEG` are supported.');

                        m.edit(embed);
                        return;
                    }
                    if (!err) {
                        embed = new Discord.RichEmbed();
                        embed
                            .setColor(0x00FF00)
                            .addField("**__IMAGE FOUND__**", 'Image detected! Now checking dimensions...');

                        m.edit(embed);

                        const options = {
                            url: URL,
                            dest: __dirname + "/../Images/"
                        };

                        rand.process[gId] = true;

                        //
                        // face attributes
                        //
                        download.image(options).then(({ filename }) => {
                            Jimp.read(filename).then(img => {
                                img.blur(contrast).quality(100).write(__dirname + "/../Images/" + id + ".jpg");

                                imgur.uploadFile(__dirname + "/../Images/" + id + ".jpg").then(function (json) {
                                    embed = new Discord.RichEmbed();

                                    embed
                                        .setColor(0x00FF00)
                                        .addField("**__SUCCESS__** ✅", 'Here it is!')
                                        .setImage(json.data.link);
                                    m.edit({embed});

                                    setTimeout(()=> {
                                        fs.unlink(filename,  (err) => {
                                            if (err) {
                                                console.log("failed to delete local image (1): "+err);
                                            } else {
                                                console.log('successfully deleted local image (1) ', filename);
                                            }
                                        });
                                        fs.unlink(__dirname + "/../Images/" + id + ".jpg",  (err) => {
                                            if (err) {
                                                console.log("failed to delete local image (2): "+err);
                                            } else {
                                                console.log('successfully deleted local image (2) ', __dirname + "/../Images/" + id + ".jpg");
                                            }
                                        });
                                    }, 10 * 1000);
                                }).catch(function (err) {
                                    embed = new Discord.RichEmbed();

                                    embed
                                        .setColor(0xFF7F00)
                                        .addField("**__IMAGE ERROR__**", 'Something broke...');
                                    m.edit({embed});
                                    console.error(err.message);
                                });
                            }).catch(err => {
                                embed = new Discord.RichEmbed();

                                embed
                                    .setColor(0xFF7F00)
                                    .addField("**__IMAGE ERROR__**", 'Error while editing image.');
                                m.edit({embed});
                                console.error(err);
                            });
                        }).catch((err) => {
                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0xFF0000)
                                .addField("**__IMAGE ERROR__**", 'Couldn\'t download image.');
                            m.edit({embed});
                            console.error(err);
                        });
                    }else{
                        //
                        // Dimensions error
                        //
                        embed = new Discord.RichEmbed();

                        embed
                            .setColor(0xFF0000)
                            .addField("**__IMAGE ERROR__**", 'Invalid image format or URL.\nThe URL must end with: `jpg, png, jpeg`');

                        m.edit(embed);

                        console.log(err);
                    }
                });

            });

            setTimeout(() => {
                delete rand.process[gId];
            }, 30 * 1000);
        });
    }
};