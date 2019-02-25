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
        rand.registerCommand(rand.commandPrefix, 'resize', [], (args, message) => {
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;
            let embed = new Discord.RichEmbed();
            if (args.length < 3){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: \n`' + rand.commandPrefix + 'resize (url | @user) (width pixels | original) (height pixels | original)`');

                message.channel.send({embed});
                return;
            }

            if ((isNaN(args[1]) && args[1].toLowerCase() !== 'original') || (isNaN(args[2]) && args[2].toLowerCase() !== 'original')){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", '**Invalid width or height provided.**\n**Usage**: *`' + rand.commandPrefix + 'resize (url | @user) (width | original) (height | original)`*');

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
            let width = args[1].toLowerCase() === 'original' ? 0 : Number(args[1]);
            let height = args[2].toLowerCase() === 'original' ? 0 : Number(args[2]);

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
                    if (!err) {
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
                            Jimp.read(filename).quality(100).then(img => {
                                img.resize(width <= 0 ? result.width : width, height <= 0 ? result.height : height).write(__dirname + "/../Images/" + id + ".jpg");

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
                                    .addField("**__IMAGE ERROR__**", 'Error while resizing image.');
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