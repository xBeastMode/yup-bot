let rand = require('../random_bot');
const Discord = require("discord.js");

const l = 'https://discordapp.com/oauth2/authorize?client_id=365996283267383306&scope=bot';

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'ban', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            const author = message.member;

            if (message.channel.type !== 'text'){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Cannot do that in this channel, please use in a server.');
                message.channel.send({embed});
                return;
            }

            if (!author.hasPermission("BAN_MEMBERS")){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'You have no permission to use this.');
                message.channel.send({embed});
                return;
            }

            if(args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'ban (@user) [amount of days] [reason...]`');
                message.channel.send({embed});
                return;
            }

            const mentions = message.mentions.members;

            if (mentions.array().length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'ban (@user) [amount of days] [reason...]`');

                message.channel.send({embed});
                return;
            }

            const mention = mentions.first();

            if (!mention.bannable){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", `${mention.user.username} can't be banned, perhaps I don't have permission? :(`);

                message.channel.send({embed});
                return;
            }

            let days = args[1] === undefined ? 0 : (isNaN(args[1]) ? 0 : Number(args[1]));

            args.shift();
            args.shift();

            let reason = args.length > 0 ? args.join(" ") : "";

            mention.ban({days: days, reason: reason}).then(()=>{
                embed = new Discord.RichEmbed();
                embed
                    .setColor(0xFF0000)
                    .addField("**__BANNED__**", `User ${mention.user.username} has been banned.`);
                if (reason !== ''){
                    embed.addField("**__REASON__**", reason);
                }
                if (days !== 0){
                    embed.addField("**__DAYS__**", days);
                }

                message.channel.send({embed});
            }).catch(console.error);
        });
    }
};