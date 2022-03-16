var Discord = require('discord.js');
var Tesseract = require("tesseract.js");
const { MessageAttachment, MessageEmbed } = require('discord.js');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const superagent = require('superagent');
require('discord-reply');

var client = new Discord.Client();



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'help':
                const helpEmbed = new MessageEmbed()
                    .setColor('#7B587B')
                    .setTitle('xRoyalBot')
                    .setURL('https://github.com/xroyalphantom/xRoyalBot')
                    //.setDescription('')
                    //.setThumbnail('attachment://xrb.png')
                    .addFields(
                        { 
                            name:   'Available Commands', 
                            value:  '!about - Information about xRoyalBot\n' +
                                    '!coinflip - Heads or Tails\n' +
                                    '!ocr - Include image after the command to anaylze text present in the image\n' +
                                    '!eth - Returns current ETH price in CAD and USD'
                        },
                        //{ name: '\u200B', value: '\u200B' },
                        //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    )
                    //.addField('Inline field title', 'Some value here', true)
                    //.setImage('https://i.imgur.com/AfFp7pu.png')
                    //.setTimestamp()
                    .setFooter('©SimonSWE - SimonSWE.com');
                message.channel.send(helpEmbed);
                break;
            case 'rules':
                const rulesEmbed = new MessageEmbed()
                    .setColor('#7B587B')
                    .setTitle('xRoyalBot')
                    .setURL('https://github.com/xroyalphantom/xRoyalBot')
                    .addFields(
                        { 
                            name:   'Rules', 
                            value:  '1. Be nice\n' +
                                    '2. Be respectful, no hate speech\n' +
                                    '3. Do not spam\n' +
                                    '4. No NSFW content\n' +
                                    '5. If anyone is making someone else uncomfortable, reach out to any moderator'
                        },
                        //{ name: '\u200B', value: '\u200B' },
                    )
                    .setFooter('©SimonSWE - SimonSWE.com');
                message.channel.send(rulesEmbed);
                break;
            case 'socials':
                const socialsEmbed = new MessageEmbed()
                    .setColor('#7B587B')
                    .setTitle('xRoyalBot')
                    .setURL('https://github.com/xroyalphantom/xRoyalBot')
                    .addFields(
                        { 
                            name:   'Twitch', 
                            value:  'https://www.twitch.tv/xroyalphantom'
                        },
                        { 
                            name:   'Twitter', 
                            value:  'https://twitter.com/xRoyalPhantom1'
                        },
                        { 
                            name:   'TikTok', 
                            value:  'https://www.tiktok.com/@xroyalphantom'
                        },
                        { 
                            name:   'Instagram', 
                            value:  'https://www.instagram.com/SimonMLG'
                        },
                        { 
                            name:   'Website', 
                            value:  'http://SimonSWE.com'
                        },
                        { 
                            name:   'GitHub', 
                            value:  'https://github.com/xroyalphantom'
                        },
                        { 
                            name:   'LinkedIn', 
                            value:  'https://www.linkedin.com/in/simon-d-huang'
                        },
                        //{ name: '\u200B', value: '\u200B' },
                    )
                    .setFooter('©SimonSWE - SimonSWE.com');
                message.channel.send(socialsEmbed);
                break;
            case 'getroles':
                const cheeseEmoji = '🧀';
                const trollEmoji = '👹';
                const monkeEmoji = '🐵';

                const channel = '953343997261266974';

                const cheeserRole = message.guild.roles.cache.find(role => role.name === "Cheeser");
                const trollerRole = message.guild.roles.cache.find(role => role.name === "Troller");
                const monkeRole = message.guild.roles.cache.find(role => role.name === "Monke");

                const getRolesEmbed = new MessageEmbed()
                    .setColor('#7B587B')
                    .setTitle('xRoyalBot')
                    .setURL('https://github.com/xroyalphantom/xRoyalBot')
                    .addFields(
                        { 
                            name:   'React for Roles', 
                            value:  `Cheeser  ${cheeseEmoji}\n` +
                                    `Troll  ${trollEmoji}\n` +
                                    `Monke ${monkeEmoji}`
                        },
                        //{ name: '\u200B', value: '\u200B' },
                    )
                    .setFooter('©SimonSWE - SimonSWE.com');
                let messageEmbed = await message.channel.send(getRolesEmbed);
                messageEmbed.react(cheeseEmoji);
                messageEmbed.react(trollEmoji);
                messageEmbed.react(monkeEmoji);

                client.on('messageReactionAdd', async (reaction, user) => {
                    if(user.bot) return;
                    else if(!reaction.message.guild) return;
                    else if(reaction.message.partial) await reaction.message.fetch();
                    else if(reaction.partial) await reaction.fetch();
                
                    if(reaction.message.channel.id == channel) {
                        if(reaction.emoji.name === cheeseEmoji) await reaction.message.guild.members.cache.get(user.id).roles.add(cheeserRole);
                        else if(reaction.emoji.name === monkeEmoji) await reaction.message.guild.members.cache.get(user.id).roles.add(monkeRole);
                        else if(reaction.emoji.name === trollEmoji) await reaction.message.guild.members.cache.get(user.id).roles.add(trollerRole);
                    }
                    else return;
                });
                
                client.on('messageReactionRemove', async (reaction, user) => {
                    if(user.bot) return;
                    else if(!reaction.message.guild) return;
                    else if(reaction.message.partial) await reaction.message.fetch();
                    else if(reaction.partial) await reaction.fetch();
                
                    if(reaction.message.channel.id == channel) {
                        if(reaction.emoji.name === cheeseEmoji) await reaction.message.guild.members.cache.get(user.id).roles.remove(cheeserRole);
                        else if(reaction.emoji.name === trollEmoji) await reaction.message.guild.members.cache.get(user.id).roles.remove(trollerRole);
                        else if(reaction.emoji.name === monkeEmoji) await reaction.message.guild.members.cache.get(user.id).roles.remove(monkeRole);
                    }
                    else return;
                });
                
                break;
            case 'about':
                message.lineReply("xRoyalBot is a bot made with Node.js by xRoyalPhantom (Simon). Visit SimonSWE.com for more information on him!");
                break;
            case 'coinflip':
                var int = Math.floor((Math.random() * 2) + 1);
                if(int === 1) message.lineReply("Heads");
                else message.lineReply("Tails");
                break;
            case 'eth':
                superagent.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,CAD')
                .query({})
                .end((err, res) => {
                    if (err) { return console.log(err); }
                    message.lineReply(
                        "ETH price in USD is $" + res.body.USD + "\n" +
                        "ETH price in CAD is $" + res.body.CAD
                        );
                });
                break;
            case 'gas':
                superagent.get('https://ethgas.watch/api/gas')
                .end((err, res) => {
                    if (err) { return console.log(err); }
                    message.lineReply(
                        "Slow: " + res.body.slow + " Gwei\n" +
                        "Normal: " + res.body.normal + " Gwei\n" +
                        "Fast: " + res.body.fast + " Gwei"
                        );
                });
                break;
            case 'ocr':
                if (message.attachments.size > 0) {
                    message.attachments.forEach((attachment) => {
                        var ImageUrl = attachment.proxyURL;
                        Tesseract.recognize(
                            ImageUrl,
                            "eng",
                            { logger: (m) => console.log(m) }
                        ).then(({ data: { text } }) => {
                            console.log(text);
                            if(text === "") text = "No characters could be read";
                            message.lineReply("Text observed:\n\n" +  text);
                        });
                    });
                }
                else {
                    message.lineReply("Unable to scan");
                }
                break;
            case 'recognize':
                if (message.attachments.size > 0) {
                    message.lineReply("Not yet implemented");
                    /*
                    message.attachments.forEach((attachment) => {
                        const imageUrl = attachment.url;
                        console.log(imageUrl);
                        const tfimage = tfnode.node.decodeImage(imageUrl); //Expected image (BMP, JPEG, PNG, or GIF), but got unsupported 
                        const mobilenetModel = mobilenet.load();
                        mobilenetModel.classify(tfimage).then((predictions) => {
                            const result = predictions.sort((a, b) => a > b)[0];
                            var text = "";
                            if (result.probability > 0.2) {
                                const probability = Math.round(result.probability * 100);
                                text = `${probability}% confident this is a ${result.className.replace(","," or")}`;
                            } else {
                                text = "Image cannot be analyzed";
                            }
                            message.lineReply(text);
                        });
                    });
                    */
                }
                else {
                    message.lineReply("Unable to recognize");
                }
        }
    } 
});
  

//auth.token
client.login(
    
    process.env.DJS_TOKEN
    );
  