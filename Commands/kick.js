let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'kick', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            const author = message.member;

            if (message.channel.type !== 'text'){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Cannot do that in this channel, please use in a server.');
                message.channel.send({embed});
                return;
            }

            if (!author.hasPermission("KICK_MEMBERS")){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'You have no permission to use this.');
                message.channel.send({embed});
                return;
            }

            if(args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'kick (@user) [reason...]`');
                message.channel.send({embed});
                return;
            }

            const mentions = message.mentions.members;

            if (mentions.array().length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'kick (@user) [reason...]`');

                message.channel.send({embed});
                return;
            }

            const mention = mentions.first();

            if (!mention.kickable){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", `${mention.user.username} can't be kicked, perhaps I don't have permission? :(`);

                message.channel.send({embed});
                return;
            }

            args.shift();
            let reason = args.length > 0 ? args.join(" ") : "";

            mention.kick(reason).then(()=>{
                embed = new Discord.RichEmbed();
                embed
                    .setColor(0xFF7F00)
                    .addField("**__KICKED__**", `User ${mention.user.username} has been kicked.`);
                if (reason !== ''){
                    embed.addField("**__REASON__**", reason);
                }

                message.channel.send({embed});
            }).catch(console.error);
        });
    }
};