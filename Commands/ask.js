let rand = require('../random_bot');
const Discord = require("discord.js");

const q = [
    "If you really wanna know... Yisss",
    "Nah",
    "Neh...",
    "Yuh",
    "Maybe",
    "Not sure, dawg",
    "Uhh...Why not?",
    "It's possible",
    "There's very low chances",
    "Not a chance...",
    "Not for real",
    "Sorry, I was told to keep it a secret",
    "You think I don't know that? Yes...",
    "Lol... no",
    "Foreal foreal foreal... yes",
    "LMAO! yeah",
    "Not gonna lie, that's true",
    "Let's be real here, it's not secret... yes",
    "9/10 doctors say yes",
    "I'd say... noh",
    "How about nah?",
    "Lemme ask",
    "Um.. Yes",
];

module.exports = {
    init: function () {
        let randoms = function (array) {
            return array[Math.round(Math.random() * array.length | 0)];
        };
        rand.registerCommand(rand.commandPrefix, 'am', ['is', 'does', 'will', 'can', 'did', 'should', 'shall', 'do', 'would', 'are'], (args, message, prefix) => {
            let embed = new Discord.RichEmbed();
            if (args.length < 2) {
                embed
                    .setColor(0xFF7F00)
                    .addField("**__INVALID__**", 'Please ask an actual question...');
                message.channel.send({embed});
                return;
            }
            let string = '**' + randoms(q) + '**';
            embed
                .setColor(0x00FF00)
                .addField("**__" + prefix.toUpperCase() + " " + args.join(" ").toUpperCase() + "__**", string);
            message.channel.send({embed});
        });
    }
};