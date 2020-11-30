const Discord = require('discord.js');
const bot = new Discord.Client();

import { OAUTH_TOKEN } from "./constants"
const token = OAUTH_TOKEN;

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
//For avoiding Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
})
.listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});



const PREFIX = '!';

bot.on('ready', () =>{
  console.log('This bot is online.');
})


bot.on('message', message => {

  // Ignores webhook messages
  if (message.webhookID) return;
  // Ignores bot messages (self or not)
  if (message.author.bot) return;

  // Splits the message into an array, removing the "!" in the beginning
  var cmdArrayMsg = message.content.toLowerCase().substring(PREFIX.length).split(" ");
  // Splits the message into an array, without removing anything
  var arrayMsg = message.content.toLowerCase().split(' ');


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Setting variables to search for a role
  var roles = message.guild.roles;
  var adminRole = roles.cache.find(r => r.name === 'Admin');
  var modRole = roles.cache.find(r => r.name === 'Mod');
  var everyone = roles.cache.find(r => r.name === '@everyone');


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Example (if message comes from a Mod, complete the function):
  if(adminRole) {
    // Finish function if message is from a mod
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Setting variables to search for a channel name
  var generalChannel = message.guild.channels.cache.find(channel => channel.name === "general");
  // Example: (If message is written in 'general' channel, complete the function):
  if(message.channel.name === 'general') {
    if(message.author.bot) return;
    // Finish the function if message is sent in the 'general' channel
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Rewriting permission to a certain channel:
  function rewriteGeneralPermissions() {
    generalChannel.overwritePermissions([
      {
        id: modRole, // message.guild.roles.cache.find(r => r.name === 'Mod')
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        deny: ['MANAGE_CHANNELS']
      },
      {
        id: everyone, // message.guild.roles.cache.find(r => r.name === '@everyone')
        allow: ['VIEW_CHANNEL'],
        deny: ['SEND_MESSAGES']
      }
    ], 'Reason why overwrite.');
    message.channel.send('This channel has been overwritten.');
  }
  // If admin/mod says 'overwrite general chat', overwrite permissions
  if(adminRole || modRole) {
    if(message.content.toLowerCase() === 'overwrite general chat') {
      // Run the function
      rewriteGeneralPermissions();
    }
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // PREFIX Commands
  // If the first word starts with a "!",
  // remove it and treat it like a command
  // Using the first word in the array as a switch/case
  switch(cmdArrayMsg[0].toLowerCase()){
    case 'help':
      message.reply("here's a list of some commands:");
      message.channel.send("`!website` - Links you to our website.\n`!help` - Displays some help commands.");
    break;
    case 'commands':
      message.reply("here's a list of some commands:");
      message.channel.send("`!website` - Links you to our website.\n`!help` - Displays some help commands.");
    break;
    case 'social':
      if(args[1] === 'instagram'){
        message.channel.send("<https://instagram.com>");
      }
      else if(args[1] === 'twitter'){
        message.channel.send("<https://twitter.com>");
      }
      else{
        message.channel.send("Instagram: <https://instagram.com>\nTwitter: <https://twitter.com>");
      }
    break;
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Welcome page and greeting
  // Must type 'agree' to enter discord server
  var welcomeChannel = message.guild.channels.cache.find(channel => channel.name === "welcome");
  if(message.channel.name === 'welcome') {
    if(!adminRole || !modRole || everyone) {
      if(arrayMsg[0] === 'agree'){
        // If typed in properly, add this role to that member
        var xRole = message.guild.roles.cache.find(role => role.name == 'X Role');
        message.member.roles.add(xRole);
        // And delete their message
        message.delete();
      }
      // Otherwise it will log the mistype and delete message
      else {
        var welcomeLogger = message.guild.channels.cache.find(channel => channel.name === "welcome-log");
        welcomeLogger.send('<@' + message.author.id + '>: ' + message.content);
        message.delete();
      }
    }
    // Message delete
    else {
      message.delete();
    }
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Clips channel
  // Allows only clip URLs to be posted
  if(message.channel.name === 'clips') {
    var clipWords = [
      'clips.twitch.tv/', 'twitch.tv/[CHANNEL_NAME]/clip/',
      'clips.twitch.com/', 'twitch.com/[CHANNEL_NAME]/clip/'
    ];
    if(clipWords.some(clipWord => message.content.toLowerCase().includes(clipWord))) {
      // Allows
    }
    else {
      message.delete();
    }
  }


  /*                */
  /*    EXAMPLE     */
  /*                */
  // Allows only a specific UserID to post
  if(message.channel.name === 'creator-personal-channel') {
    // Check userID
    if(message.author.id === '239359370444406787') {
      if(message.author.bot) return;
    }
    // Delete if not user
    else {
      message.delete();
    }
  }

})



/*                                                     */
/*    Other events (other than a message received)     */
/*                                                     */
// bot.on('guildMemberAdd', member => {
//   var role = member.guild.roles.cache.find(role => role.name == 'Circuit Soldiers');
//   member.roles.add(role);
// });


// Actually logging in the bot
bot.login(token);
