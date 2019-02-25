//RANDOM BOT made by xBeastMode
"use strict";

const Discord = require('discord.js');
const bot = new Discord.Client();
const Hangman = require("./Hangman/Hangman2");

bot.login('MzY1OTk2MjgzMjY3MzgzMzA2.DL8VkA.9EHMXGEAx_ycotStLzn6-_Rtyys')
//bot.login('MzM1MjM0Mjk4NDMxMTQzOTM2.DrvMow.ErFenug1Jei3jepaJzely1e8d8U')
    .then(() => console.log('> Successfully logged in.'))
    .catch(console.error);

bot.on('ready', () => {
    console.log('> Bot is online in a total of %s servers.', bot.guilds.array().length);
    bot.user.setActivity(helpCommand);
});

/**
 * The name of the bot
 * Used when necessary, such as
 * rich embed author.
 *
 * @type {string}
 */
const botName = 'Yup Bot';
const commandPrefix = "&";
const helpCommand = "&help";

/**
 * @type {{}}
 */
let handlers = {};

let procress = {};

/**
 * @param number
 * @param precision
 *
 * @returns {number}
 */
let precisionRound = function(number, precision) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

/**
 * @param str
 *
 * @returns {string}
 */
let upperCaseEveryFirstLetter = function(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
};

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHexString(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * @param prefix
 * @param command
 * @param aliases
 * @param handler
 */
let registerCommand = function(prefix, command, aliases, handler) {
    const l = aliases.length;

    if(prefix in handlers) {
        handlers[prefix][command] = handler;
    }else{
        handlers[prefix] = {};
        handlers[prefix][command] = handler;
    }

    for(let i = 0; i < l; i ++){
        handlers[prefix][aliases[i]] = handler;
    }
};


/**
 * @param message
 *
 * @returns {*[]}
 */
let parseCommandPrefixAndArgs = function(message) {
    const prefix = message.substr(0, 1).toLowerCase();
    let args = message.split(' ');
    let command = args[0].toLowerCase();

    args.shift();

    command = command.split(prefix).join("");

    return [prefix, command, args];
};

/**
 * @param prefix
 * @param command
 * @param args
 * @param message
 *
 * @return boolean
 */
let handleCommandWithPrefixAndArgs = function(prefix, command, args, message){
    if(prefix in handlers && command in handlers[prefix]){
        handlers[prefix][command](args, message, command);
        return true;
    }
    return false;
};

module.exports = {
    precisionRound: precisionRound,
    upperCaseEveryFirstLetter: upperCaseEveryFirstLetter,
    registerCommand: registerCommand,
    botName: botName,
    commandPrefix: commandPrefix,
    helpCommand: helpCommand,
    Hangman: Hangman,
    Bot: bot,
    /**
     * @return {boolean}
     */
    validateUrl: (str) => {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    },
    rgbToHex: (r, g, b) => {
        return (r << 16) + (g << 8) + b
    },
    rgbToHexString: rgbToHexString,
    getLuma: (r, g, b) => {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },
    process: procress
};

//require('./Commands/asciitext').init();
require('./Commands/ask').init();
require('./Commands/ban').init();
require('./Commands/blur').init();
require('./Commands/brightness').init();
require('./Commands/contrast').init();
require('./Commands/deepfry').init();
require('./Commands/eval').init();
require('./Commands/extractcolors').init();
require('./Commands/greyscale').init();
require('./Commands/guess').init();
require('./Commands/hangman').init();
require('./Commands/info').init();
require('./Commands/invert').init();
require('./Commands/kick').init();
require('./Commands/leni').init();
require('./Commands/military').init();
require('./Commands/nickname').init();
require('./Commands/nicknameall').init();
require('./Commands/opacity').init();
require('./Commands/pick').init();
require('./Commands/pixelate').init();
require('./Commands/pmbuild').init();
require('./Commands/query').init();
require('./Commands/resize').init();
require('./Commands/rotate').init();
require('./Commands/screenshot').init();
require('./Commands/sepia').init();
require('./Commands/translate').init();
require('./Commands/twitter').init();
require('./Commands/who').init();
require('./Commands/wiggle').init();

bot.on('message', (message) => {
    const body = message.content;
    const parsed = parseCommandPrefixAndArgs(body);
    const prefix = parsed[0];
    const command = parsed[1];
    const args = parsed[2];
    handleCommandWithPrefixAndArgs(prefix, command, args, message);
});


/* Registering Handlers */

registerCommand(commandPrefix, 'help', [], (args, message) => {
    const embed = new Discord.RichEmbed();

    let helpList = {
        '**__HANGMAN__**': [
            'guess (letter)',
            'hangman',
            'hangman reset',
        ],
        '**__IMAGE MANIPULATION__**': [
            'blur  (url | @user) (percentage)',
            'brightness (url | @user) (percentage)',
            'contrast (url | @user) (percentage)',
            'deep-fry (url | @user)',
            'extract-colors (url | @user)',
            'greyscale (url | @user)',
            'invert (url | @user)',
            'leni (url | @user)',
            'opacity (url | @user) (percentage)',
            'pixelate (url | @user) (percentage)',
            'resize (url | @user) (width | original) (height | original)',
            'rotate (url @user) (degrees)',
            'screenshot (url)',
            'sepia (url | @user)'
        ],
        '**__MODERATION__**': [
            'ban (@user) [amount of days] [reason...]',
            'kick (@user) [reason...]',
            'nickname (@user) (nickname... | reset)',
            'nicknameall (nickname... | reset)'
        ],
        '**__RANDOM__**': [
            'military (country...)',
            'twitter (search query...)',
            'who (question...)',
            'wiggle (times to wiggle) (text)'
        ],
        '**__TOOLS__**': [
            'eval (code...)',
            'info (...)',
            'pmbuild',
            'translate (to language) (text)',
            'query (host) (port)'
        ]
    };


    embed
        .setColor(0x7FFF7F);

    let i = 0;

    for(let k in helpList){
        let out = "";
        for(let k2 in helpList[k]) {
            out += "• **" + commandPrefix + helpList[k][k2] + "**\n";
        }
        i++;
        embed.addField(k, out);
    }

    embed.setThumbnail("https://i.imgur.com/BUkt8Ya.png");

    message.channel.send({embed});
});

// registerCommand('n', 'o', [], (args, message) => {
//     if(args.length < 1) return;
//
//     if(args.join(' ').toLowerCase().includes('u')) {
//         message.channel.send('NO U');
//         /*message.react("🔄").catch((error) => {
//             console.log("Adding reaction failed: ", error);
//         });*/
//     }else if (args.join(' ').toLowerCase().includes('me')){
//         message.channel.send('YEAH U');
//         /*message.react("👍").catch((error) => {
//             console.log("Adding reaction failed: ", error);
//         });*/
//     }
// });

bot.on('disconnected', () => console.log('Bot disconnected.'));