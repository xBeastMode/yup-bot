let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'nicknameall', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            const author = message.member;

            if (message.channel.type !== 'text'){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Cannot do that in this channel, please use in a server.');
                message.channel.send({embed});
                return;
            }

            if (!author.hasPermission("MANAGE_NICKNAMES")){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'You have no permission to use this.');
                message.channel.send({embed});
                return;
            }

            if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'I don\'t have permission to change nicknames...');
                message.channel.send({embed});
                return;
            }

            if(args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'nicknameall (nickname... | reset)`');
                message.channel.send({embed});
                return;
            }

            args = args.join(' ');

            let nick = args === 'reset' ? '' : args;
            let members = message.guild.members.array();

            embed
                .setColor(0x0000FF)
                .addField("**__WORKING__**", 'Changing nicknames, please wait...');
            message.channel.send(embed).then(m => {
                let f = 0;
                global.s = 0;
                global.p = 0;
                members.forEach(v => {
                    if (v.manageable) {
                        v.setNickname(nick).then(() => {
                            global.s++;
                            global.p++;
                            if (global.p >= members.length) {
                                embed = new Discord.RichEmbed();
                                embed
                                    .setColor(0x00FF00)
                                    .addField("**__RESULT__**", 'Changed ' + global.s + (global.s > 1 ? ' nicks' : ' nick') + ' and failed to change ' + f + (f > 1 ? ' nicks' : ' nick') + '.');

                                m.edit({embed});
                            }else{
                                let percent = ((global.s / members.length) * 100).toPrecision(2);
                                embed = new Discord.RichEmbed();
                                embed
                                    .setColor(0xFF7F00)
                                    .addField("**__PROGRESS__**", percent + '% complete.');
                                m.edit({embed});
                            }
                        }).catch(console.error);
                    } else {
                        f++;
                        global.p++;
                    }
                });
            });
        });
    }
};