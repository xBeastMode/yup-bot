let rand = require('../random_bot');
const Discord = require("discord.js");
const imgur = require("imgur");
const sightengine = require('sightengine')("1867250152", "UXsffdVB5qbcwGu8AqF2");
const probe = require('probe-image-size');
const fs = require("fs");
const Canvas = require("canvas");

module.exports = {
    init: function () {
        imgur.setClientId("abb374bc4ebb61b");
        rand.registerCommand(rand.commandPrefix, 'extract-colors', [], (args, message) => {
            const id = message.channel.id + message.id;
            const gId = message.channel.type === "text" ? message.guild.id : message.channel.id;
            let embed = new Discord.RichEmbed();
            if (args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'extract-colors (url | @user)`');

                message.channel.send({embed});
                return;
            }

            if (gId in rand.process){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Already in progress');
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
                            .addField("**__IMAGE FOUND__**", 'Image detected! Now checking colors..');

                        m.edit(embed);
                        //
                        // face attributes
                        //
                        sightengine.check(['properties']).set_url(URL).then(function(result2) {
                            let dominant = result2.colors.dominant;
                            let accent = result2.colors.accent === undefined ? [] : result2.colors.accent;
                            let other = result2.colors.other === undefined ? [] : result2.colors.other;

                            let w = (((accent.length + other.length) - ((accent.length + other.length) % 2)) * 40) / 2;
                            let h = (accent.length + other.length) % 8 === 0 ? ((accent.length + other.length) * 20) - 80 : ((accent.length + other.length)* 20);
                            h = h + ((accent.length + other.length) % 4 === 0 ? 40 : 0);

                            let canvas = new Canvas(w, h);
                            let context = canvas.getContext("2d");

                            let currentX = 0;
                            let currentY = 0;

                            let num = 1;

                            context.fillStyle = dominant.hex;
                            context.fillRect(currentX, currentY, 40, 40);
                            context.fillStyle = rand.getLuma(dominant.r, dominant.g, dominant.b) < 40 ? '#7F7F7F' : '#000000';
                            context.fillText(num.toString(), currentX + 20, currentY + 20);
                            currentX += 40;
                            num++;

                            accent.forEach(dominant => {
                                context.fillStyle = dominant.hex;
                                context.fillRect(currentX, currentY, 40, 40);
                                context.fillStyle = rand.getLuma(dominant.r, dominant.g, dominant.b) < 40 ? '#7F7F7F' : '#000000';
                                context.fillText(num.toString(), currentX + 20, currentY + 20);
                                currentX += 40;
                                if(currentX >= w){
                                    currentX = 0;
                                    currentY += 40;
                                }
                                num++;
                            });

                            other.forEach(dominant => {
                                context.fillStyle = dominant.hex;
                                context.fillRect(currentX, currentY, 40, 40);
                                context.fillStyle = rand.getLuma(dominant.r, dominant.g, dominant.b) < 40 ? '#7F7F7F' : '#000000';
                                context.fillText(num.toString(), currentX + 20, currentY + 20);
                                currentX += 40;
                                if(currentX >= w){
                                    currentX = 0;
                                    currentY += 40;
                                }
                                num++;
                            });

                            let buf = canvas.toBuffer();
                            fs.writeFileSync(__dirname + '/../Images/' + id + '.png', buf);

                            imgur.uploadFile(__dirname + '/../Images/' + id + '.png').then(json => {
                                let dominant = result2.colors.dominant;
                                let accent = result2.colors.accent === undefined ? [] : result2.colors.accent;
                                let other = result2.colors.other === undefined ? [] : result2.colors.other;

                                let accentOutput = '';
                                let otherOutput = '';

                                let num = 1;

                                embed = new Discord.RichEmbed();
                                embed
                                    .setColor(rand.rgbToHex(dominant.r, dominant.g, dominant.b))
                                    .addField("**__DOMINANT COLOR__**",
                                        '**__' + num.toString() + '__**.\n' +
                                        '→**RGB**: ' + dominant.r + ', ' + dominant.g + ', ' + dominant.b + '\n' +
                                        '→**HEX**: ' + dominant.hex + '\n' +
                                        '→**DEC**: ' + rand.rgbToHex(dominant.r, dominant.g, dominant.b, true)
                                    );
                                num++;

                                accent.forEach(dominant => {
                                    accentOutput +=
                                        '**__' + num.toString() + '__**.\n' +
                                        '→**RGB**: ' + dominant.r + ', ' + dominant.g + ', ' + dominant.b + '\n' +
                                        '→**HEX**: ' + dominant.hex + '\n' +
                                        '→**DEC**: ' + rand.rgbToHex(dominant.r, dominant.g, dominant.b) + '\n';
                                    num++;
                                });

                                other.forEach(dominant => {
                                    otherOutput +=
                                        '**__' + num.toString() + '__**.\n' +
                                        '→**RGB**: ' + dominant.r + ', ' + dominant.g + ', ' + dominant.b + '\n' +
                                        '→**HEX**: ' + dominant.hex + '\n' +
                                        '→**DEC**: ' + rand.rgbToHex(dominant.r, dominant.g, dominant.b) + '\n\n';
                                    num++;
                                });

                                if (accentOutput !== ''){
                                    embed
                                        .addField("**__ACCENT COLORS__**", accentOutput);
                                }
                                if (otherOutput !== ''){
                                    embed
                                        .addField("**__OTHER COLORS__**", otherOutput);
                                }
                                embed
                                    .setImage(json.data.link);
                                m.edit({embed});

                                setTimeout(()=> {
                                    fs.unlink(__dirname + '/../Images/' + id + '.png',  (err) => {
                                        if (err) {
                                            console.log("failed to delete local image (extract-colors): "+err);
                                        } else {
                                            console.log('successfully deleted local image (extract-colors): ', __dirname + '/../Images/' + id + '.png');
                                        }
                                    });
                                }, 10 * 1000);
                                delete rand.process[gId];
                            }).catch(err => {
                                embed = new Discord.RichEmbed();

                                embed
                                    .setColor(0xFF7F00)
                                    .addField("**__IMAGE ERROR__**", 'Failed to upload image.');
                                m.edit({embed});
                                console.error(err.message);
                                delete rand.process[gId];
                            });
                        }).catch(function(err) {
                            //
                            // face attributes error
                            //

                            embed = new Discord.RichEmbed();

                            embed
                                .setColor(0xFF7F00)
                                .addField("**__IMAGE ERROR__**", 'Failed to extract colors.');
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