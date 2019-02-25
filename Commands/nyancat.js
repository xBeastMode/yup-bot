let rand = require('../random_bot');
const Discord = require("discord.js");

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'nyan', [], (args, message) => {
            let embed = new Discord.RichEmbed();
            embed
                .setColor(0xFF7F00)
                .addField("**__NYAN__**", 'Here goes nyan...');

            message.channel.send({embed}).then(m => {
                let nyan = [
                    'THE END.',
                    '-~',
                    '~-~-~-',
                    '-~-~-~- =|:',
                    '~-~-~-~ =|::|(',
                    '-~-~-~ =|::|(:3)',
                    '~-~-~ =|::|(:3)',
                    '-~-~-=|::|(:3)',
                    '~-~-=|::|(:3)',
                    '-~-=|::|(:3)',
                    '~-=|::|(:3)',
                    '-=|::|(:3)',
                    '=|::|(:3)',
                    '|::|(:3)',
                    '::|(:3)',
                    ':|(:3)',
                    '|(:3)',
                    '(:3)',
                    ':3)',
                    '3)',
                    ')',
                    '',
                ];
                let color = [
                        0x9400D3,
                        0x4B0082,
                        0x0000FF,
                        0x00FF00,
                        0xFFFF00,
                        0xFF7F00,
                        0xFF0000,
                ];
                let index = nyan.length - 1;
                let cIndex = color.length - 1;
                let v = setInterval(()=>{
                    index--;
                    if (index < 0){
                        clearInterval(v);
                        return;
                    }
                    cIndex--;
                    if (cIndex < 0){
                        cIndex = color.length - 1;
                    }
                    let embed = new Discord.RichEmbed();
                    embed
                        .setColor(color[cIndex])
                        .addField("**__NYAN__**", nyan[index]);
                    m.edit({embed});
                }, 1000)
            })
        });
    }
};