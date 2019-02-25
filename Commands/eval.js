let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'eval', [], (args, message) => {
            const embed = new Discord.RichEmbed();

            const id = message.author.id;

            if(id !== '335234298431143936'){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__NOPE__**", 'Go away, ugly!');

                message.channel.send({embed});

                return;
            }else{
                if(args.length < 1){
                    embed
                        .setColor(0xFF7F00)
                        .addField("**__ERROR__**", 'Insufficient arguments.');
                }else {
                    const code = args.join(' ');
                    const start = Date.now();
                    let now = 0;
                    try {
                        const evalReturn = eval(code);
                        now = Math.round(Date.now() - start);

                        embed
                            .setColor(0x00FF7F)
                            .addField("**__CODE__**", '```' + code + '```')
                            .addField("**__RETURN__**", '```' + evalReturn + '```' + "\nTimestamp is `" + now + "` milliseconds");
                    }catch (e) {
                        embed
                            .setColor(0xFF0000)
                            .addField("**__CODE__**", '```' + code + '```')
                            .addField("**__ERROR__**", '```' + e.toString() + '```' + "\nTimestamp is `" + now + "` milliseconds");
                    }
                }
            }

            message.channel.send({embed});
        });
    }
};