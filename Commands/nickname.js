let rand = require('../random_bot');
const Discord = require("discord.js");

const l = 'https://discordapp.com/oauth2/authorize?client_id=365996283267383306&scope=bot';

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'nickname', [], (args, message) => {
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

            if(args.length < 2){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'nickname (@user) (nickname... | reset)`');
                message.channel.send({embed});
                return;
            }

            const mentions = message.mentions.members;

            if (mentions.array().length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'nickname (@user) (nickname... | reset)`');

                message.channel.send({embed});
                return;
            }

            const mention = mentions.first();

            if (!message.guild.me.hasPermission("MANAGE_NICKNAMES") || !mention.manageable){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", `I don't have sufficient permission to change ${mention.user.username}'s nickname.`);

                message.channel.send({embed});
                return;
            }

            args.shift();
            args = args.join(' ');

            let nick = args === 'reset' ? '' : args;

            mention.setNickname(nick).then(()=>{
                embed = new Discord.RichEmbed();
                embed
                    .setColor(0x00FF00)
                    .addField("**__SUCCESS__**", nick === '' ? mention.user.username + '\'s nickname has been reset.' : mention.user.username + '\'s nickname has been changed to ' + nick + '.');

                message.channel.send({embed});
            }).catch(console.error);
        });
    }
};