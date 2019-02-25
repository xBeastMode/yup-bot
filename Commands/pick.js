let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        let randoms = function (array) {
            return array[Math.round(Math.random() * array.length | 0)];
        };
        rand.registerCommand(rand.commandPrefix, 'pick', [], (args, message, prefix) => {
            let embed = new Discord.RichEmbed();
            args = args.join(" ").split(" or ");
            if (args.length < 2) {
                embed
                    .setColor(0xFF7F00)
                    .addField("**__INVALID__**", 'Please use: &pick (foo...) or (bar...)');
                message.channel.send({embed});
                return;
            }
            let string = '**' + randoms(args) + '**';
            embed
                .setColor(0x00FF00)
                .addField("**__" + args.join(" or ") + "__**", "I pick: " + string);
            message.channel.send({embed});
        });
    }
};