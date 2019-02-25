let rand = require('../random_bot');
const Discord = require("discord.js");
const exec = require("child_process");

let servers = {};
let created = {};
let installCommands = {
    'win': ''
};
let openWin = 'C:\\cygwin64\\bin\\mintty.exe -i /Cygwin-Terminal.ico -';
let serverLimit = 6;

function s2hms(secs) {
    secs = Math.round(secs);
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
}

function createServer(message, durationSeconds) {
    let author = message.author.id;
    let server = message.text.type === 'text' ? message.guild.id : message.channel.id;
    let time = new Date().getTime() + durationSeconds;
    const embed = new Discord.RichEmbed();

    exec.exec(openWin, (err) => {
        if (err) {
            const embed = new Discord.RichEmbed();
            embed
                .setColor(0xFF7F00)
                .addField("**__ISSUE__**", 'Sorry I encountered an error while downloading the file. Try later.');
            message.channel.send({embed});
            console.log(err);
        }

    });
}

let time = 60 * 60 * 24 * 7;

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'makeserver', [], (args, message) => {
            let author = message.author.id;
            const embed = new Discord.RichEmbed();

            if (servers.length > limit){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__LIMIT__**", 'Server limit has been reached.');
                message.channel.send({embed});
            }
            if (author in created) {
                let lastCreated = created[author]['created'];
                let now = new Date().getTime() / 1000;
                if ((now - lastCreated) < time) {
                    const hms = s2hms(time - (now - lastCreated));
                    embed
                        .setColor(0xFF7F00)
                        .addField("**__TIMEOUT__**", '**You can create a new server again in**:\n *' + hms['h'] + ' hours, ' + hms['m'] + ' minutes, and ' + hms['s'] + ' seconds*');
                    message.channel.send({embed});
                    return;
                }else{

                }
            }

            if (os.platform() === 'win32'){
            }
        });
    }
};