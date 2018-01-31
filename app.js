var tmi = require('tmi.js');

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "CanadianBotEh",
        password:  "oauth:41fndmc1q4dcygmhlmxzhreey77bge"
    },
    channels: ["canadianplayer"]
};

var client = new tmi.client(options);
client.connect();

client.on('chat', function(channel, user, message, self){
    switch(message){
        case "!youtube":
            client.action("canadianplayer", "Youtube: https://www.youtube.com/channel/UC3_PkedWTotwhlSd3PLWdXw")
            break;
        case "!twitter":
            client.action("canadianplayer", "Twitter: https://twitter.com/CANADlANPLAYER")
            break;
        case "!opgg":
            client.action("canadianplayer", "OP.GG: http://na.op.gg/multi/query=cincere%2Cehpolarbear")
            break;
        case "!commands":
            client.action("canadianplayer", "!youtube !twitter !opgg !points !gamble [slots/flip] [betAmount] !redeem [redeemAmount] !rewards")
            break;
        case "!rewards":
            client.action("canadianplayer", "500: Select a champion for me to play, 1000: Choose a game for me to play, 1500: Play a game with me!")
            break;
        //Displays users current points
        case "!points":
            var fs = require("fs");
            fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
            var i = 0;
            var currentUser = "";
            //Reads until nothing left in the file
            while(data[i] != null){                 
                currentUser += data[i]
                i++;
            }
            var splitUsers = currentUser.split(",");                        
            //For loop to go through the file to see if the user has any points
            for(var i = 0; i < splitUsers.length - 1; i++){
                //Splits up the name right until the first bracket which holds the users current points
                var name = String(splitUsers[i].match(/^[^\(]+/g));     
                //Gets the users points         
                var userPoints = Number(splitUsers[i].match(/\(([^)]+)\)/)[1]);                 
                console.log(name);
                console.log(userPoints);                                
                //If the user is on the file display their name and file
                if(user['display-name'] == name){
                    console.log("Displaying user score...")
                    console.log("-------")
                    client.action("canadianplayer", user['display-name'] + " has " + userPoints + " points")                    
                //Does nothing rn, except displays that they are the wrong user
                }else{
                    console.log("Wrong user...");
                    console.log("-------")
                }                
            }
            if(!data.match(user['display-name'])){
                    client.action("canadianplayer", "You need to be watching for at least 2 minutes before you start earning points!")
            }        

            });
            break;

    //When the user makes a sarcastic remark such as your are so good the bot responds with the Kappa emote       
    }   
    var patternGucci = /so good*/;
    if(message.match(patternGucci)){
        client.action("canadianplayer", "Kappa")
    }

    //GAMBLING COMMANDS
    var areTheyGambling = message.split(" ");
    if(areTheyGambling[0] == "!gamble"){
        if(areTheyGambling[1] == "slots"){
            var fs = require("fs");
            var data = fs.readFileSync('updatedPoints.txt', 'utf-8');
            fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
            var i = 0;
            var currentUser = "";
            //Reads until nothing left in the file
            while(data[i] != null){                 
                currentUser += data[i]
                i++;
            }
            var splitUsers = currentUser.split(",");
            for(var i = 0; i < splitUsers.length - 1; i++){
                //Splits up the name right until the first bracket which holds the users current points
                var name = String(splitUsers[i].match(/^[^\(]+/g));     
                //Gets the users points         
                var userPoints = Number(splitUsers[i].match(/\(([^)]+)\)/)[1]);                 
                console.log(name);
                console.log(userPoints);                                
                //If the user is on the file display their name and file
                if(user['display-name'] == name){
                    console.log(name)
                    console.log("NOICE")
                    console.log("-------")
                    if(!isNaN(areTheyGambling[2]) && areTheyGambling[2] <= userPoints && areTheyGambling[2] != 0){
                        console.log("LETS GAMBLE")
                        //Rolls a number between 1 and 10 and acts as slots, the only winning numbers are 3 and 7, but if you win, you win 10 times the amount of points you put in!
                        var coin = Math.floor((Math.random() * 10) + 1);
                        switch(coin){
                            case 1:
                            console.log("LOSER");
                            client.action("canadianplayer", "| Kappa | HeyGuys | KappaRoss |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8'); 
                            break;

                            case 2:                            
                            console.log("LOSER");
                            client.action("canadianplayer", "| CoolCat | PogChamp | KappaRoss |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 3:
                            console.log("WINNER");
                            client.action("canadianplayer", "| PogChamp | PogChamp | PogChamp |");
                            client.action("canadianplayer", "You won the mega jackpot!"); 
                            var loserReward = userPoints + (Number(areTheyGambling[2]*10));
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 4:
                            console.log("LOSER");
                            client.action("canadianplayer", "| CoolCat | PogChamp | PogChamp |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 5:
                            console.log("LOSER");
                            client.action("canadianplayer", "| CoolCat | PogChamp | CoolCat |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 6:
                            console.log("LOSER");
                            client.action("canadianplayer", "| CoolCat | PogChamp | HeyGuys |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 7:
                            console.log("WINNER");
                            client.action("canadianplayer", "| PogChamp | PogChamp | PogChamp |");
                            client.action("canadianplayer", "You won the mega jackpot!"); 
                            var loserReward = userPoints + (Number(areTheyGambling[2]*10));
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 8:
                            console.log("LOSER");
                            client.action("canadianplayer", "| KappaRoss | KappaRoss | HeyGuys |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 9:
                            console.log("LOSER");
                            client.action("canadianplayer", "| PogChamp | CoolCat | HeyGuys |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;

                            case 10:
                            console.log("LOSER");
                            client.action("canadianplayer", "| CoolCat | HeyGuys | HeyGuys |");
                            client.action("canadianplayer", "You lost, sorry!"); 
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');                            
                            break;
                        }
                    }else{
                       client.action("canadianplayer", "Invalid value inputted or you do not have that many points!"); 
                    }                  
                    
                }
            }
            });
            console.log("They chose to play slots")            
        }
        //Choice option if the user decides they want to gamble by flipping a coin.
        if(areTheyGambling[1] == "flip"){
            var fs = require("fs");
            var data = fs.readFileSync('updatedPoints.txt', 'utf-8');
            fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
            var i = 0;
            var currentUser = "";
            //Reads until nothing left in the file
            while(data[i] != null){                 
                currentUser += data[i]
                i++;
            }
            var splitUsers = currentUser.split(",");
            for(var i = 0; i < splitUsers.length - 1; i++){
                //Splits up the name right until the first bracket which holds the users current points
                var name = String(splitUsers[i].match(/^[^\(]+/g));     
                //Gets the users points         
                var userPoints = Number(splitUsers[i].match(/\(([^)]+)\)/)[1]);                 
                console.log(name);
                console.log(userPoints);                                
                //If the user is on the file display their name and file
                if(user['display-name'] == name){
                    console.log(name)
                    console.log("NOICE")
                    console.log("-------")
                    if(!isNaN(areTheyGambling[2]) && areTheyGambling[2] <= userPoints && areTheyGambling[2] != 0){
                        console.log("LETS GAMBLE")
                        //Coin flips either a 1 or a 2 (heads or tails). And you win if it is tails
                        var coin = Math.floor((Math.random() * 2) + 1);
                        if(coin == 1){
                            console.log("LOSER");
                            var loserReward = userPoints - Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+loserReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');
                            client.action("canadianplayer", "You lost, sorry!"); 
                        }else{
                            console.log("WINNER");
                            var winnerReward = userPoints + Number(areTheyGambling[2]);
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+winnerReward+")");
                            fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');
                            client.action("canadianplayer", "WOHOO! Congrats you won :)"); 
                        }
                    }else{
                       client.action("canadianplayer", "Invalid value inputted or you do not have that many points!"); 
                    }
                    //var test = 100;
                    //var newValue = data.replace(name+"("+userPoints+")", name+"("+test+")");
                    //fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');
                    
                }
            }
            });
            console.log("They chose to flip a coin")
            
        }
    }
    if(areTheyGambling[0] == "!redeem"){
        var fs = require("fs");
            var data = fs.readFileSync('updatedPoints.txt', 'utf-8');
            fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
            var i = 0;
            var currentUser = "";
            //Reads until nothing left in the file
            while(data[i] != null){                 
                currentUser += data[i]
                i++;
            }
            var splitUsers = currentUser.split(",");
            for(var i = 0; i < splitUsers.length - 1; i++){
                //Splits up the name right until the first bracket which holds the users current points
                var name = String(splitUsers[i].match(/^[^\(]+/g));     
                //Gets the users points         
                var userPoints = Number(splitUsers[i].match(/\(([^)]+)\)/)[1]);                 
                console.log(name);
                console.log(userPoints);                                
                //If the user is on the file display their name and file
                if(user['display-name'] == name){
                    if(!isNaN(areTheyGambling[1]) && areTheyGambling[1] <= userPoints && areTheyGambling[1] != 0 && areTheyGambling[1] == 500 || areTheyGambling[1] == 1000 || areTheyGambling[1] == 1500){
                        var redeemedPoints = userPoints - Number(areTheyGambling[1]);
                        var newValue = data.replace(name+"("+userPoints+")", name+"("+redeemedPoints+")");
                        fs.writeFileSync('updatedPoints.txt', newValue, 'utf-8');
                        client.action("canadianplayer", "Thanks for you redeeming your points!");
                        client.action("canadianplayer", "@CanadianPlayer a reward has been chosen")
                    }else{
                       client.action("canadianplayer", "Invalid value inputted or you have not selected the right tier amount! Use !rewards to find out!"); 
                    }
                }
            }
            })
        }
});

//Monitors chat and adds new viewers to a list in order to keep track of their points
client.on('connected', function(address, port){ 
        //Gives display message that the bot has connected
        client.action("canadianplayer", "This awesome bot has just entered your channel!");
        //Sets an interval and checks every 2 minutes for new viewers that want to stay. This filters out people who just quickly look at your stream and shouldnt be added to the database of users with points
        setInterval(function(){
            var fs = require("fs");
            const request = require('request');     
            request('https://tmi.twitch.tv/group/user/canadianplayer/chatters', function (error, response, body) {
            data = JSON.parse(body);
            var viewers = data.chatters.viewers;        
            fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
                for(var i in viewers){
                    var viewer = viewers[i];
                    console.log("CURRENT VIEWER:");
                    console.log(viewer);
                    if(!data.match(viewer)){
                        console.log("ADDING NEW USER");
                        fs.appendFileSync('updatedPoints.txt', viewer + '(0),');
                    } 
                }               
                
            })                            
        })  
        }, 120000);
        //Adds 10 points to each user who is currently watching the stream every minute
        setInterval(function(){            
            var fs = require("fs");
            var data = fs.readFileSync('updatedPoints.txt', 'utf-8');
            const request = require('request');     
            request('https://tmi.twitch.tv/group/user/canadianplayer/chatters', function (error, response, body){
                //The data is from the url which gives information about  the channel
                data = JSON.parse(body);
                //Grabs the viewers from the JSON received                
                var viewers = data.chatters.viewers;
                console.log(viewers); 
                fs.readFile("updatedPoints.txt", {encoding: "utf8"}, function(error, data){
                var i = 0;
                var currentUser = "";
                //Reads until nothing left in the file
                while(data[i] != null){                 
                    currentUser += data[i]
                    i++;
                }
                var splitUsers = currentUser.split(",");
                for(let i = 0; i < splitUsers.length - 1; i++){
                    //Splits up the name right until the first bracket which holds the users current points
                    var name = String(splitUsers[i].match(/^[^\(]+/g));     
                    //Gets the users points         
                    var userPoints = Number(splitUsers[i].match(/\(([^)]+)\)/)[1]);                 
                    console.log(name);
                    console.log(userPoints);
                    for(let x in viewers){
                        var viewer = viewers[x];
                        if(name.match(viewer)){                                                
                            var test = userPoints + 10;
                            var newValue = data.replace(name+"("+userPoints+")", name+"("+test+")");
                            data = newValue;
                            fs.writeFileSync('updatedPoints.txt', data, 'utf-8');
                            console.log('readFileSync complete');
                        }      
                    }                    
                                  
                }
                });

            })
            }, 60000);            
});

