let rand = require('../random_bot');
const Discord = require("discord.js");
const imgur = require("imgur");
const sightengine = require('sightengine')("1867250152", "UXsffdVB5qbcwGu8AqF2");
const probe = require('probe-image-size');
const images = require("images");
const download = require('image-downloader');
const fs = require("fs");

module.exports = {
    init: function () {
        imgur.setClientId("abb374bc4ebb61b");
        rand.registerCommand(rand.commandPrefix, 'leni', [], (args, message) => {
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;
            let embed = new Discord.RichEmbed();
            if (args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'leni (url | @user)`');

                message.channel.send({embed});
                return;
            }

            if (gId in rand.process){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Fry-er in progress.');
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
                        //
                        // face attributes
                        //
                        sightengine.check(['face-attributes']).set_url(URL).then(function(result2) {

                            const options = {
                                url: URL,
                                dest: __dirname + "/../Images/"
                            };

                            download.image(options).then(({ filename }) => {
                                let img = images(filename);
                                img.size(result.width, result.height);

                                let emoji = images(__dirname + "/../Images/lenny.png");
                                let found = false;

                                result2.faces.forEach(k => {
                                    let x1 = k.x1 * result.width;
                                    let y1 = k.y1 * result.height;
                                    let x2 = k.x2 * result.width;
                                    let y2 = k.y2 * result.height;

                                    let width = (x2 - x1);
                                    let height = (y2 - y1);

                                    emoji.size(width, height);

                                    img.draw(emoji, x1, y1);

                                    found = true;
                                });

                                if (!found){
                                    emoji.size(result.width / 2, result.height / 2);
                                    img.draw(emoji, result.width / 4, result.height / 4);
                                }

                                img.save(__dirname + "/../Images/" + id + ".jpg", {
                                    quality : 50
                                });

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
                                        .addField("**__IMAGE ERROR__**", 'Something broke while trying to leni.\nThis is probably on my side.');
                                    m.edit({embed});
                                    console.error(err.message);
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
                        }).catch(function(err) {
                            //
                            // face attributes error
                            //

                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0xFF7F00)
                                .addField("**__IMAGE ERROR__**", 'Your image is immune to lenis.');
                            m.edit({embed});
                            console.log(err);

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