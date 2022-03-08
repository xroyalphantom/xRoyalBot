var Discord = require('discord.js');
//var auth = require('./auth.json');
var Tesseract = require("tesseract.js");
var mobilenet = require('@tensorflow-models/mobilenet');
require('discord-reply');

let model;
var client = new Discord.Client();


function displayDescription(predictions) {
    //Sort by probability
    const result = predictions.sort((a, b) => a > b)[0];
  
    if (result.probability > 0.2) {
        const probability = Math.round(result.probability * 100);
  
        return `${probability}% confident this is a ${result.className.replace(
            ",",
            " or"
        )}`;
    } else return "No clue";
}
  

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
                message.lineReply(
                    "Available Commands:\n\n" +
                    "!about - Information about xRoyalBot" +
                    "!coinflip - Heads or Tails\n" +
                    "!ocr - Include image after the command to anaylze text present in the image\n"
                    );
                break;
            case 'about':
                message.lineReply("xRoyalBot is a bot made with Node.js by xRoyalPhantom (Simon)");
                break;
            case 'coinflip':
                var int = Math.floor((Math.random() * 2) + 1);
                if(int === 1) message.lineReply("Heads");
                else message.lineReply("Tails");
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
                        var ImageUrl = attachment.url;
                        model.classify(ImageUrl).then((predictions) => {
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
    "OTUwMjQ2ODQ2ODA1MTkyNzA0.YiWIVw.Tqwb4l8C74FH0-IzJkr9-8GIyss"
    //process.env.DJS_TOKEN
    );


mobilenet.load().then((m) => {
    model = m;
});
  