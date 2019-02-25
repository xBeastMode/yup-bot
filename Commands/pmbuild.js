let rand = require('../random_bot');
const Discord = require("discord.js");
const request = require("request");
const exec = require('child_process');

module.exports = {
    init: function () {
        let lockedDownload = false;

        rand.registerCommand(rand.commandPrefix, 'pmbuild', [], (args, message) => {
            let url = "https://jenkins.pmmp.io/job/PocketMine-MP/lastSuccessfulBuild/artifact/build_info.json";

            if(lockedDownload){
                const embed = new Discord.RichEmbed();

                embed
                    .setColor(0xFF7F00)
                    .addField("**__TIMEOUT__**", 'Command is blocked for 10 seconds to prevent abuse.');

                message.channel.send({embed});

                return;
            }

            lockedDownload = true;

            request({
                    url: url,
                    json: true
                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        let embed = new Discord.RichEmbed();

                        const dat = "\n**PHP Version**: " + body['php_version']
                            +
                            "\n**PMMP Version**: " + body['pm_version']
                            +
                            "\n**Build Number**: " + body['build_number']
                            +
                            "\n**Branch**: " + body['branch']
                            +
                            "\n**Git Commit**: " + body['git_commit']
                            +
                            "\n**API Version**: " + body['base_version']
                            +
                            "\n**MCPE Version**: " + body['mcpe_version']
                            +
                            "\n**Phar Name**: " + body['phar_name'];

                        embed
                            .setTitle("**__PROGRESS__**")
                            .setColor(0x007FFF)
                            .setDescription("Please wait while I save and upload the phar...");

                        message.channel.send({embed}).then(msg1 => {

                            let dtime = Date.now();

                            let url = "http://jenkins.pmmp.io/job/PocketMine-MP/lastSuccessfulBuild/artifact/PocketMine-MP.phar";

                            exec.exec('wget -O ' + __dirname + '/../Files/PocketMine-MP.phar "' + url + '"', (err, stdout, stderr) => {
                                if (err) {
                                    const embed = new Discord.RichEmbed();

                                    embed
                                        .setColor(0xFF7F00)
                                        .addField("**__ISSUE__**", 'Sorry I encountered an error while downloading the file. Try later.');

                                    message.channel.send({embed});

                                    console.log(err);
                                    return;
                                }

                                dtime = rand.precisionRound((Date.now() - dtime) / 1000, 2);

                                let utime = Date.now();

                                message.channel.send("**__Success, here is the latest phar! ✅__**", {files: ['./PocketMine-MP.phar']}).then(() => {

                                    utime = rand.precisionRound((Date.now() - utime) / 1000, 2);

                                    let embed = new Discord.RichEmbed();
                                    embed
                                        .setColor(0x00FF00)
                                        .setDescription(
                                            dat + "\n" +
                                            "**Download Time**: `" + dtime + "` seconds"
                                            + "\n" +
                                            "**Upload Time**: `" + utime + "` seconds"
                                        );

                                    msg1.delete();

                                    message.channel.send(embed);
                                });

                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                            });
                        });
                    }
                });

            setTimeout(() => {
                lockedDownload = false;
            }, 10000);
        });
    }
};