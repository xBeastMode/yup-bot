let rand = require('../random_bot');
const Discord = require("discord.js");
const Twitter = require('twitter');

module.exports = {
    init: function () {
        const client = new Twitter({
            consumer_key: 'XK1MnA1Ee3Xhod4Jzv0YKSMKW',
            consumer_secret: 'SZ270TdadR6ELIL6gzCpUufEjjBsufShY4dHNJSBz7eDvkMQ6M',
            access_token_key: '885139478121250816-gBntfkhKEhqqiD7FCoPXDaxsFsB0lry',
            access_token_secret: 'MoK16TSAex2DSSJXAUXWxXsCqqyOOilmbgLWvB7ddZUD3'
        });
        rand.registerCommand(rand.commandPrefix, 'twitter', [], (args, message) => {

            if(args.length < 1){
                const embed = new Discord.RichEmbed();
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'twitter (search query...)`');

                message.channel.send({embed});
                return;
            }

            const query = args.join(" ");

            let time = Date.now();
            client.get('search/tweets', {q: query}, function(error, tweets, response) {
                if(error){
                    const embed = new Discord.RichEmbed();
                    embed
                        .setColor(0xFF7F00)
                        .addField("**__ERROR__**", 'Error while fetching tweets.');

                    message.channel.send({embed});

                    console.log(error);
                    return;
                }


                //console.log(response);

                const body = JSON.parse(response['body']);
                const embed = new Discord.RichEmbed();

                if (body['statuses'][0] === undefined){
                    embed
                        .setColor(0x0000FF)
                        .addField("**__NO TWEETS__**", 'No tweets were found for this search.');

                    message.channel.send({embed});

                    return;
                }
                time = Math.round(Date.now() - time);
                embed
                    .setColor(0x00aced)
                    .setDescription(body['statuses'][0]['text'])

                    .setAuthor(body['statuses'][0]['user']['name'] + "(@" + body['statuses'][0]['user']['screen_name'] + ")", body['statuses'][0]['user']['profile_image_url'])
                    .setFooter("Took " + time + " milliseconds to fetch " + body['statuses'].length + " tweets.");

                if(body['statuses'][0]['retweeted_status'] !== undefined){

                    if(body['statuses'][0]['retweeted_status']['retweeted_count'] !== undefined) {
                        embed
                            .addField("Re-tweets", body['statuses'][0]['retweeted_status']['retweeted_count'], true)
                    }else{
                        embed
                            .addField("Re-tweets", "0", true)
                    }
                    if (body['statuses'][0]['retweeted_status']['favorite_count'] !== undefined) {
                        embed.addField("Favorites", body['statuses'][0]['retweeted_status']['favorite_count'], true)
                    }else{
                        embed.addField("Favorites", "0", true)
                    }
                }
                if(body['statuses'][0]['entities']['media'] !== undefined){
                    embed.setImage(body['statuses'][0]['entities']['media'][0]['media_url']);
                }

                message.channel.send({embed});
            });
        });
    }
};