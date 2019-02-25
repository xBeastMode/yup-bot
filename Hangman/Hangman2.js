const utils = require("./Utils");

let channels = {};

let Hangman = {

    STATUS: {
        ERROR_NOT_PLAYING: 0,
        LETTER_FAIL: 1,
        LETTER_SUCCESS: 2,
        GAME_LOST: 3,
        GAME_WIN: 4,
        ALREADY_SUGGESTED: 5,
    },
    /**
     * @param word
     * @param channelId
     *
     * @constructor
     */
    setWord: function (word, channelId) {
        word = word.replace("-", " ");
        word = word.replace("'", "");
        word = utils.accentToLatin(word);
        channels[channelId] = {
            'word_parts': word.split(""),
            'world_length': word.length,
            'used_letters': [],
            'hangman': [
                '', '', ''
            ],
            'progress': '_'.repeat(word.length).split(""),
            'tries': 0
        };
    },

    /**
     * @param channelId
     *
     * @returns {boolean}
     */
    isPlaying: function (channelId) {
        return channelId in channels;
    },

    /**
     * @param channelId
     *
     * @returns {number}
     */
    checkLoss: function (channelId) {
        if(!this.isPlaying(channelId)){
            return this.STATUS.ERROR_NOT_PLAYING;
        }
        if(channels[channelId]['tries'] >= 6) {
            return this.STATUS.GAME_LOST;
        }
        return this.STATUS.LETTER_SUCCESS;
    },

    /**
     * @param letter
     * @param channelId
     *
     * @returns {number}
     */
    trySuggestion: function (letter, channelId) {
        if(!this.isPlaying(channelId)){
            return this.STATUS.ERROR_NOT_PLAYING;
        }

        let parts = channels[channelId]['word_parts'];
        let fail = true;

        if(channels[channelId]['used_letters'].indexOf(letter) > -1){
            return this.STATUS.ALREADY_SUGGESTED;
        }

        parts.forEach((v, k) => {
            if(v === letter){
                channels[channelId]['progress'][k] = letter;
                fail = false;
            }
        });

        if(channels[channelId]['progress'].indexOf("_") === -1){
            return this.STATUS.GAME_WIN;
        }

        if(fail){

            switch(channels[channelId]['tries']){
                case 0:
                    channels[channelId]['hangman'][0] += ' O';
                    break;
                case 1:
                    channels[channelId]['hangman'][1] += '/';
                    break;
                case 2:
                    channels[channelId]['hangman'][1] += '|';
                    break;
                case 3:
                    channels[channelId]['hangman'][1] += '\\';
                    break;
                case 4:
                    channels[channelId]['hangman'][2] += '/';
                    break;
                case 5:
                    channels[channelId]['hangman'][2] += ' \\';
                    break;
            }

            channels[channelId]['tries']++;

            channels[channelId]['used_letters'].push(letter);

            return this.STATUS.LETTER_FAIL;
        }else{
            channels[channelId]['used_letters'].push(letter);
            return this.STATUS.LETTER_SUCCESS;
        }
    },

    getAlreadyUsedLetters: function (channelId) {
        if(!this.isPlaying(channelId)){
            return this.STATUS.ERROR_NOT_PLAYING;
        }

        return channels[channelId]['used_letters'].join(", ");
    },

    reset: function (channelId) {
        delete channels[channelId];
    },

    getStringOutput: function (channelId) {
        let hangman = channels[channelId]['hangman'];
        hangman = [
            "\n```md",
            "--------",
            "|    |",
            "|   " + hangman[0],
            "|   " + hangman[1],
            "|   " + hangman[2],
            "|\n   Progress: \n   " + channels[channelId]['progress'].join("") + "```"
        ];
        return hangman.join("\n");
    },

    getWord: function (channelId) {
        return channels[channelId]['word_parts'].join("");
    }
};

module.exports = Hangman;