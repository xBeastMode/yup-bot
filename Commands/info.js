let rand = require('../random_bot');
const Discord = require("discord.js");
const os = require("os");

const l = 'https://discordapp.com/oauth2/authorize?client_id=365996283267383306&scope=bot';

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'info', [], (args, message) => {
            const embed = new Discord.RichEmbed();
            const dat = "\n**PLATFORM**: " + os.platform()
                +
                "\n**GUILD COUNT**: " + rand.Bot.guilds.array().length
                +
                `\n**INVITE URL**: [INVITE](${l})`;
            embed
                .setColor(0x36393E)
                .setTitle("BOT INFO")
                .setDescription(dat);

            message.channel.send({embed});
        });
    }
};