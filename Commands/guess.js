let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'guess', ['g'], (args, message) => {

            const embed = new Discord.RichEmbed();

            let channelId = message.channel.id;

            if(!rand.Hangman.isPlaying(channelId)){
                embed
                    .setColor(0xFF7F00)
                    .setDescription('Channel not playing.');
            }

            if(args.length < 1){
                embed
                    .setColor(0xFF7F00)
                    .setDescription('Invalid letter suggested.');

                message.channel.send({embed});

                return;
            }

            let fpl = args[0].toLowerCase();

            if (fpl.length === 1 && isNaN(fpl)) {
                let out = rand.Hangman.trySuggestion(fpl, channelId);
                if (out === rand.Hangman.STATUS.ERROR_NOT_PLAYING) {
                    embed
                        .setColor(0xFF7F00)
                        .setDescription('Channel not playing.');
                } else if (out === rand.Hangman.STATUS.GAME_WIN) {
                    embed
                        .setColor(0x00FF00)
                        .addField("**__WINNER__**", `**${message.author.username} guessed the last letter!**`)
                        .setDescription(rand.Hangman.getStringOutput(channelId));

                    rand.Hangman.reset(channelId);
                } else if (out === rand.Hangman.STATUS.LETTER_SUCCESS) {
                    embed
                        .setColor(0x00FF00)
                        .setDescription("**You have guessed a letter right!**" + rand.Hangman.getStringOutput(channelId) + "\n" + "**Already used: " + rand.Hangman.getAlreadyUsedLetters(channelId) + "**");
                } else if (out === rand.Hangman.STATUS.LETTER_FAIL) {
                    if (rand.Hangman.checkLoss(channelId) === rand.Hangman.STATUS.GAME_LOST) {
                        embed
                            .setColor(0xFF0000)
                            .setDescription("**Welp, you lost.\n" + rand.Hangman.getStringOutput(channelId) + "**\n" + "**Word was: " + rand.Hangman.getWord(channelId) + "**\n**__RIP Mr. Hangman 2018-2018__**");

                        rand.Hangman.reset(channelId);
                    }else {
                        embed
                            .setColor(0xFF7F00)
                            .addField("**__WRONG__**", "**Eesh, be smarter next time...\nThink about Mr. Hangman**" + rand.Hangman.getStringOutput(channelId) + "\n"
                                + "**Already used: " + rand.Hangman.getAlreadyUsedLetters(channelId) + "**");
                    }
                } else if (out === rand.Hangman.STATUS.ALREADY_SUGGESTED) {
                    embed
                        .setColor(0xFF7F00)
                        .addField("**__ALREADY USED__**", "**This letter has already been used.**" + "\n" + "**Already used: " + rand.Hangman.getAlreadyUsedLetters(channelId) + "**");
                }
            }

            if(fpl.length > 1 || !isNaN(fpl)){
                embed
                    .setColor(0xFF7F00)
                    .setDescription('Invalid letter suggested.');
            }

            message.channel.send({embed});
        });
    }
};