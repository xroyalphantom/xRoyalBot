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

client.on("message", (message) => {
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'help':
                /*
                message.lineReply(
                    "Available Commands:\n\n" +
                    "!about - Information about xRoyalBot\n" +
                    "!coinflip - Heads or Tails\n" +
                    "!ocr - Include image after the command to anaylze text present in the image\n" +
                    "!eth - Returns current ETH price in CAD and USD"
                    );
                */
                const helpEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('xRoyalBot')
                    .setURL('https://github.com/xroyalphantom/xRoyalBot')
                    .setDescription('')
                    .setThumbnail('attachment://xrb.png')
                    .addFields(
                        { 
                            name:   'Available Commands', 
                            value:  '!about - Information about xRoyalBot\n' +
                                    '!coinflip - Heads or Tails\n' +
                                    '!ocr - Include image after the command to anaylze text present in the image\n' +
                                    '!eth - Returns current ETH price in CAD and USD\n' +
                                    ''
                        },
                        { name: '\u200B', value: '\u200B' },
                        //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    )
                    //.addField('Inline field title', 'Some value here', true)
                    //.setImage('https://i.imgur.com/AfFp7pu.png')
                    //.setTimestamp()
                    .setFooter('©SimonSWE - SimonSWE.com');
                
                message.channel.send(helpEmbed);
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
  