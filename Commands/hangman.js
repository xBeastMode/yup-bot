let rand = require('../random_bot');
const Discord = require("discord.js");
const randomWord = require('random-word');

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'hangman', [], (args, message) => {
            const embed = new Discord.RichEmbed();

            let channelId = message.channel.id;

            if(rand.Hangman.isPlaying(channelId) && args.indexOf('reset') === -1){
                embed
                    .setColor(0xFF7F00)
                    .setDescription('Channel already playing...');
                message.channel.send({embed});
                return;
            }

            // let url = "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&" +
            //     "minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&" +
            //     "minLength=-1&maxLength=-1&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

            rand.Hangman.setWord(randomWord(), channelId);

            embed
                .setColor(0x00FF00)
                .setDescription("**Okay, let's play.\nGuess a letter from A to Z.\nUse `" + rand.commandPrefix + "g (letter)` to guess.**\n" + rand.Hangman.getStringOutput(channelId));

            message.channel.send({embed});
        });
    }
};