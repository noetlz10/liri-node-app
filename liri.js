var fs = require('fs');
var request = require('request');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: keys.spotifykeys.client_ID,
  secret: keys.spotifykeys.client_secret
});

//Prompt User Input

inquirer.prompt([
  {
    type: "list",
    message: "Please select",
    choices: ["Read my tweets", "spotify-this-song", "Get information about a film from OMDB", "Trigger the unknown"],
    name: "whichAction"
  },
  {
    type: "input",
    message: "Please enter the name of a song",
    name: "song",
    when: function(answers){return answers.whichAction === "spotify-this-song";}
  },
  {
    type: "input",
    message: "Enter the name of a film",
    name: "film",
    when: function(answers){return answers.whichAction === "Get information about a film from OMDB";}
  }
]).then(function(user) {
 
  var action = user.whichAction;
  var currentdate = new Date();   // used to set date information when writing to log.txt




  var lookup = {

//Log into log.txt

  	logTime: "Log entry created on " + currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds(),

  	log: function(thingToLog){
			fs.appendFile("log.txt", thingToLog, function(error){
				if(error)console.log("error");
			});
		},

//Twitter

		"Read my tweets": function() {
			var params = {screen_name: 'noe_tlz10', count: '20'};
			client.get('statuses/user_timeline', params, function(error, tweets) {
			  if (!error) {
			    for (var i = 0; i < tweets.length; i++) {
		    		console.log("\n" + tweets[i].created_at);
		    		console.log(tweets[i].text + "\n");
		    		lookup.log("\n" + lookup.logTime + "\n" + "Posted on " + tweets[i].created_at + "\n" + tweets[i].text + "\n");
			    }
  			}
			});
		},

//Spotify

		"spotify-this-song": function(){
			if(!user.song){user.song = "THE SIGN ace of base";}
			spotify.search({type: 'track', query: user.song, limit: 1}, function(err, data){
				if (err) {console.log("Error occurred" + err);return;}
				// console.log(JSON.stringify(data, null, 2));    //test prints the full Spotify return JSON object
				for (var i = 0; i < data.tracks.items.length; i++) {
					var songWrite = "\nThe song " +  data.tracks.items[0].name.toUpperCase() + " is by the artist " + data.tracks.items[0].artists[0].name.toUpperCase() + " and appears on the album " + data.tracks.items[0].album.name.toUpperCase() + ". To preview on Spotify, command+double-click this link: " + data.tracks.items[0].preview_url +"\n";
					console.log(songWrite);
		  		lookup.log("\n \n" + lookup.logTime + songWrite);
					
				}
			});
		},

//OMDB

		"Get information about a film from OMDB": function(){
			if(!user.film){user.film = "Mr. Nobody";}
			var queryURL = "http://www.omdbapi.com/?t=" + user.film + "&y=&plot=short&apikey=40e9cece";
			request(queryURL, function(error, response, body) {
			  if (!error && response.statusCode === 200) {
		  		var filmWrite = ("\nThe movie title is " + JSON.parse(body).Title.toUpperCase() + "\nThe film was released in " + JSON.parse(body).Year + "\nIt's IMBD Rating is " + JSON.parse(body).imdbRating + "\nThe film was produced in " + JSON.parse(body).Country + "\nThe film's language is " +JSON.parse(body).Language + "\nThe plot of the movie is " + JSON.parse(body).Plot + "\nActors in the movie include " + JSON.parse(body).Actors + "\nOfficial Website is " + JSON.parse(body).Website + "\n");
		  		console.log(filmWrite);
		  		lookup.log("\n \n" + lookup.logTime + filmWrite);
			    // console.log(response);   logs full JSON response
			  }
			});
		},

//Random

		"Trigger the unknown": function(){
			fs.readFile("random.txt", "UTF8", function(error, data){
				data = data.split(",");
				action = data[0];
				user.song = data[1];
				lookup[action]();
			});
		}
	};  // End of lookup-Action object

	

	lookup[action]();

});