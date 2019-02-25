const whos = [
    "According to 100 strong farm boys...",
    "Your mom says...",
    "My gut feeling says...",
    "I asked your teacher and she said...",
    "I'm 420% sure it's...",
    "I prompted all your close cousins and they said...",
    "I bet you it's...",
    "In accordance to Donald Trump's new law it's....",
    "The fox says...",
    "Asked the entire PMMP community, everyone came to the conclusion that it is...",
    "I asked bikini bottom and most fish voted...",
    "My homies agreed that it is...",
    "C'mon, we all know its...",
    "LMAO ðŸ˜‚",
    "TRULY...",
    "Yup, you have guessed it...",
    "The one and only!!!",
    "Vladimir Putin suggests...",
    "I asked your pediatrician, they say...",
    "The statue of liberty responded",
    "Santa believes...",
    "I asked 1000 single women, they told me it's...",
    "The blue prince says...",
    "Like being really honest, it's...",
    "Your lawyer told me...",
    "After a whole discussion, we all agreed that it's...",
    "Your ex claimed it's...",
    "If my calculations are correct"
];

let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        let randoms = function (array) {
            return array[Math.round(Math.random() * array.length | 0)];
        };
        rand.registerCommand(rand.commandPrefix, 'who', ['whois', 'whos'], (args, message) => {
            let embed = new Discord.RichEmbed();
            if (message.channel.type !== 'text') {
                embed
                    .setColor(0xFF7F00)
                    .addField("**__INVALID__**", 'Please use this in a server.');
                message.channel.send({embed});
                return;
            }
            if (args.length < 2) {
                embed
                    .setColor(0xFF7F00)
                    .addField("**__INVALID__**", 'Please ask an actual question...');
                message.channel.send({embed});
                return;
            }
            const membersArray = message.guild.members.array();
            let random = randoms(membersArray).user;
            while (random.bot) {
                random = randoms(membersArray).user;
            }
            let string = '**' + randoms(whos) + '**\n*' + random.username + '*';
            embed
                .setColor(0x00FF00)
                .addField("**__WHO " + args.join(" ").toUpperCase() + "__**", string);
            message.channel.send({embed});
        });
    }
};