let rand = require('../random_bot');
const Discord = require("discord.js");

let wiggle = {};

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'wiggle', [], (args, message) => {
            let output = "";
            let space = "";
            let gId = message.channel.id;

            const embed = new Discord.RichEmbed();

            let parts = args;

            if (parts < 2 || isNaN(parts[0])) {
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'wiggle (times to wiggle) (text...)`');

                message.channel.send({embed});

                return;
            }

            if (gId in wiggle){

                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Wiggle in progress.');
                message.channel.send({embed});

                return;
            }

            let hasAdmin = true;
            if (message.channel.type === "text"){
                hasAdmin = !!(message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Administrator") || message.member.roles.find("name", "Wiggle"));
            }

            if (hasAdmin){
                wiggle[gId] = true;

                let width = 10;
                let halfWidth = width / 2;
                let times = Number(parts[0]);

                let txt = parts;
                txt.shift();
                txt = txt.join(" ");

                for (let h = 0; h < times; ++h) {
                    for (let i = 0; i < width; ++i) {
                        if (i > halfWidth) {
                            if (space !== "") {
                                space = space.substring(0, space.length - 2);
                            }
                            output += space + txt + "\n";
                        } else {
                            space += " ";
                            output += space + txt + "\n";
                        }
                    }
                }

                let start = 0;
                let v = " ";

                while (v.length > 0) {
                    v = output.substring(start, start + 2000);
                    if (v === ""){
                        delete wiggle[gId];
                        return;
                    }
                    start += 2000;
                    message.channel.send(v)
                }
            }else{
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'You need one of the following roles: `Admin, Administrator, Wiggle`');

                message.channel.send({embed});
            }
        });
    }
};
