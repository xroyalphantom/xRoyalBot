var Discord = require('discord.js');
//var auth = require('./auth.json');
var Tesseract = require("tesseract.js");
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
            case 'ocr':
                if (message.attachments.size > 0) {
                    message.attachments.forEach((attachment) => {
                        var ImageURL = attachment.proxyURL;
                        Tesseract.recognize(
                            ImageURL,
                            "eng",
                            { logger: (m) => console.log(m) }
                        ).then(({ data: { text } }) => {
                            console.log(text);
                            message.lineReply("Text observed:\n\n" + text);
                        });
                    });
                }
                else {
                    message.lineReply("Unable to scan");
                }
                break;
            case 'coinflip':
                var int = Math.floor((Math.random() * 2) + 1);
                if(int === 1) message.lineReply("Heads");
                else message.lineReply("Tails");
                break;
        }
    } 
  });
  

  //originally auth.token
  client.login(process.env.DJS_TOKEN);
  