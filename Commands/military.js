let rand = require('../random_bot');
const Discord = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");
const countries = require('country-list')();

module.exports = {
    init: function () {
        rand.registerCommand(rand.commandPrefix, 'military', [], (args, message) => {
            const embed = new Discord.RichEmbed();

            if (args.length >= 0){
                embed
                    .setColor(0xFF7F00)
                    .addField("**__MAINTENANCE__**", 'This command is currently unavailable, updates are being done.');
                message.channel.send({embed});

                return;
            }

            if(args.length < 1){
                embed
                    .setColor(0xFF0000)
                    .addField("**__ERROR__**", 'Usage: `' + rand.commandPrefix + 'military (country)`');

                message.channel.send({embed});

                return;
            }

            let country = args.join('-').toLowerCase();

            let time = Date.now();

            request('https://www.globalfirepower.com/country-military-strength-detail.asp?country_id=' + country, function (error, response, html) {
                if (!error && response.statusCode === 200) {
                    let $ = cheerio.load(html);
                    const main = $('span.textLarger.textBold.textWhite');
                    const all = $('span.textLarger.textBold');

                    //total of everything
                    const population = $(main[0]).text();
                    const totalAircraftStrength = $(main[1]).text();
                    const totalNavalAssets = $(main[2]).text();
                    const oilConsumtion = $(main[3]).text(); //barrels per day
                    const externalDebt = $(main[4]).text();
                    const coastline = $(main[5]).text();
                    const sharedBorders = $(main[6]).text();

                    //population
                    const manpower = $(all[6]).text();
                    const fitForService = $(all[7]).text();
                    const reachingMilitaryAge = $(all[8]).text();
                    const totalMilitaryPersonnel = $(all[9]).text();
                    const activePersonnel = $(all[10]).text();
                    const reservePersonnel = $(all[11]).text();

                    //aircraft
                    const fighterAircraft = $(all[13]).text();
                    const attackAircraft = $(all[14]).text();
                    const transportAircraft = $(all[15]).text();
                    const trainerAircraft = $(all[16]).text();
                    const totalHelicopterStrength = $(all[17]).text();
                    const attackHelicopters = $(all[18]).text();

                    //army
                    const combatTanks = $(all[19]).text();
                    const armoredFightingVehicles = $(all[20]).text();
                    const selfPropelledArtillery = $(all[21]).text();
                    const towedArtillery = $(all[22]).text();
                    const rocketProjectors = $(all[23]).text();

                    //navy
                    const aircraftCarriers = $(all[25]).text();
                    const frigates = $(all[26]).text();
                    const destroyers = $(all[27]).text();
                    const corvettes= $(all[28]).text();
                    const submarines = $(all[29]).text();
                    const patrolCraft = $(all[30]).text();
                    const mineWarfareVessels = $(all[31]).text();

                    //petroleum
                    const productionBarrels = $(all[32]).text();
                    const provenReservesBarrels = $(all[34]).text();

                    //logistics
                    const laborForce = $(all[35]).text();
                    const merchantMarineStrength = $(all[36]).text();
                    const MajorPorts = $(all[37]).text();
                    const roadwayCoverage = $(all[38]).text();
                    const railwayCoverage = $(all[39]).text();
                    const servicableAirports = $(all[40]).text();

                    //finance
                    const defenseBudget = $(all[41]).text();
                    const foreignExchange = $(all[43]).text();
                    const purchasingPowerParity = $(all[44]).text();

                    //geography
                    const squareLandArea = $(all[45]).text();
                    const waterways = $(all[48]).text();


                    const manpowerOutput =
                        "Total Population → " + population + "\n"
                        +
                        "Manpower Available → " + manpower + "\n"
                        +
                        "Fit For Service → " + fitForService + "\n"
                        +
                        "Reaching Military Age → " + reachingMilitaryAge + "\n"
                        +
                        "Total Military Personnel → " + totalMilitaryPersonnel + "\n"
                        +
                        "Active Personnel → " + activePersonnel + "\n"
                        +
                        "Reserve Personnel → " + reservePersonnel  + "\n"
                    ;

                    const airpowerOutput =
                        "Total Aircraft Strength → " + totalAircraftStrength + "\n"
                        +
                        "Fighter Aircraft → " + fighterAircraft + "\n"
                        +
                        "Attack Aircraft → " + attackAircraft + "\n"
                        +
                        "Transport Aircraft → " + transportAircraft + "\n"
                        +
                        "Trainer Aircraft → " + trainerAircraft + "\n"
                        +
                        "Total Helicopter Strength → " + totalHelicopterStrength + "\n"
                        +
                        "Attack Helicopters → " + attackHelicopters  + "\n"
                    ;

                    const armyStrengthOutput =
                        "Combat Tanks → " + combatTanks + "\n"
                        +
                        "Armored Fighting Vehicles → " + armoredFightingVehicles + "\n"
                        +
                        "Self Propelled Artillery → " + selfPropelledArtillery + "\n"
                        +
                        "Towed Artillery → " + towedArtillery + "\n"
                        +
                        "Rocket Projectors → " + rocketProjectors  + "\n"
                    ;

                    const navyStrengthOutput =
                        "Total Naval Assets → " + totalNavalAssets + "\n"
                        +
                        "Aircraft Carriers → " + aircraftCarriers + "\n"
                        +
                        "Frigates → " + frigates + "\n"
                        +
                        "Destroyers → " + destroyers + "\n"
                        +
                        "Corvettes → " + corvettes  + "\n"
                        +
                        "Submarines → " + submarines  + "\n"
                        +
                        "Patrol Craft → " + patrolCraft  + "\n"
                        +
                        "Mine Warfare Vessels → " + mineWarfareVessels  + "\n"
                    ;

                    const naturalResourceOutput =
                        "Production (Barrels Per Day) → " + productionBarrels + "\n"
                        +
                        "Consumption (Barrels Per Day) → " + oilConsumtion + "\n"
                        +
                        "Proven Reserves (Barrels) → " + provenReservesBarrels + "\n"
                    ;

                    const logisticsOutput =
                        "Labor Force → " + laborForce + "\n"
                        +
                        "Merchant Marine Strength → " + merchantMarineStrength + "\n"
                        +
                        "Major Ports → " + MajorPorts  + "\n"
                        +
                        "Roadway Coverage → " + roadwayCoverage + "\n"
                        +
                        "Railway Coverage → " + railwayCoverage + "\n"
                        +
                        "Serivecable Airports → " + servicableAirports  + "\n"
                    ;

                    const financeOutput =
                        "Defense Budget → " + defenseBudget + "\n"
                        +
                        "External Debt → " + externalDebt + "\n"
                        +
                        "Foreign Exchange → " + foreignExchange + "\n"
                        +
                        "Purchasing Power Parity → " + purchasingPowerParity  + "\n"
                    ;

                    const geographyOutput =
                        "Square Land Area (kilometers) → " + squareLandArea + "\n"
                        +
                        "Coastline (kilometers) → " + coastline + "\n"
                        +
                        "Shared Borders (kilometers) → " + sharedBorders + "\n"
                        +
                        "Waterways (kilometers) → " + waterways + "\n"
                    ;

                    time = Math.round(Date.now() - time);
                    const code = countries.getCode(rand.upperCaseEveryFirstLetter(args.join(" ").replace(/ of america/gi, "")));
                    if (code !== undefined){
                        embed.setThumbnail("https://www.countryflags.io/" + code.toLowerCase() + "/flat/64.png");
                    }

                    embed
                        .setColor(0x00FF00)
                        .setTitle(rand.upperCaseEveryFirstLetter(args.join(" ") + " Military Power"))
                        .addField('**__Manpower__**:', manpowerOutput)
                        .addField('**__Air Power__**:', airpowerOutput)
                        .addField('**__Army Strength__**:', armyStrengthOutput)
                        .addField('**__Navy Strength__**:', navyStrengthOutput)
                        .addField('**__Natural Resource__**:', naturalResourceOutput)
                        .addField('**__Logistics__**:', logisticsOutput)
                        .addField('**__Finance__**:', financeOutput)
                        .addField('**__Geography__**:', geographyOutput)
                        .setFooter("Took " + time + " milliseconds to fetch data.");


                    message.channel.send({embed});

                } else if (response.statusCode === 500) {

                    embed
                        .setColor(0xFF0000)
                        .addField("**__ERROR__**", "Invalid country name, please provide full valid name of a country.");

                    message.channel.send({embed});
                }
            });
        });
    }
};