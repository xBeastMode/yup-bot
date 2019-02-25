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
        rand.registerCommand(rand.commandPrefix, 'invert', [], (args, message) => {
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;
            let embed = new Discord.RichEmbed();
            if (args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: \n`' + rand.commandPrefix + 'invert (url | @user)`');

                message.channel.send({embed});
                return;
            }

            if (gId in rand.process){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Image in progress.');
                message.channel.send({embed});
                return;
            }

            embed
                .setColor(0x007FFF)
                .addField("**__PROGRESS__**", 'Working... This may take a while...');

            let URL = args[0];

            const mentions = message.mentions.members;
            if (mentions !== null && mentions.array().length > 0){
                rand.Bot.fetchUser(mentions.array()[0].id).then(myUser => {
                    URL = myUser.avatarURL;
                    URL = URL.substring(0, URL.length - 10);
                });

            }

            rand.process[gId] = true;

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
                        delete rand.process[gId];
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

                        //
                        // face attributes
                        //
                        download.image(options).then(({ filename }) => {
                            Jimp.read(filename).then(img => {
                                img.invert().quality(100).write(__dirname + "/../Images/" + id + ".jpg");

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

                                    delete rand.process[gId];
                                }).catch(function (err) {
                                    embed = new Discord.RichEmbed();

                                    embed
                                        .setColor(0xFF7F00)
                                        .addField("**__IMAGE ERROR__**", 'Something broke...');
                                    m.edit({embed});
                                    console.error(err.message);
                                    delete rand.process[gId];
                                });
                            }).catch(err => {
                                embed = new Discord.RichEmbed();

                                embed
                                    .setColor(0xFF7F00)
                                    .addField("**__IMAGE ERROR__**", 'Error while editing image.');
                                m.edit({embed});
                                console.error(err);
                                delete rand.process[gId];
                            });
                        }).catch((err) => {
                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0xFF0000)
                                .addField("**__IMAGE ERROR__**", 'Couldn\'t download image.');
                            m.edit({embed});
                            console.error(err);
                            delete rand.process[gId];
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

                        delete rand.process[gId];
                    }
                });

            });
        });
    }
};