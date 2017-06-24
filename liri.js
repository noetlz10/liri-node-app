//Initialize variables and NPMs
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var twit = new Twitter(keys.twitterKeys);
var spotify = require('spotify');
var userInput1 = process.argv[2];
var userInput2 = process.argv[3];
var logArray = [];

//Check user inputs and run appropriate function
if(userInput1 == 'my-tweets'){
  tweets();
}else if(userInput1 == 'spotify-this-song'){
  if(userInput2 == undefined){//if user didn't specify a song one is assigned
    userInput2 = "what's my age again";  
  }
  spotty();
}else if(userInput1 == 'movie-this'){
  if(userInput2 == undefined){//if user didn't specify a movie one is assigned
    userInput2 = "mr nobody";  
  }
  movie();  
}else if(userInput1 == 'do-what-it-says'){
  randCommand();  
}else{
  //Log proper command instructions to the console
  console.log("Invalid Command");
  console.log("Try one of the following commands...");
  console.log("node liri.js my-tweets");
  console.log('node liri.js spotify-this-song "<song name here>"');
  console.log('node liri.js movie-this "<movie name here>"');
}

//Append user inputs to log.txt
function appendCommand(){
  //Uses FS NPM to pass user inputs with line break in utf8 encoding
  fs.appendFile('log.txt', "Command:\r\n" + userInput1 + " " + userInput2 + "\r\n", 'utf8', function(err){   
    // If an error was experienced we say it.
    if(err){
      console.log(err);
    }
    // If no error is experienced, we'll log the phrase "Content Added" to our node console. 
    else {
      console.log("Content Added!");
    }
  })
}

//Append user inputs "assigned in randCommand function" to log.txt
function appendNoCommand(){
  //Uses FS NPM to pass user inputs with line break in utf8 encoding
  fs.appendFile('log.txt', "Command:\r\n" + userInput1 + userInput2 + "\r\n", 'utf8', function(err){   
    // If an error was experienced we say it.
    if(err){
      console.log(err);
    }
    // If no error is experienced, we'll log the phrase "Content Added" to our node console. 
    else {
      console.log("Content Added!");
    }
  })
}

//Append API response to log.txt
function appendResponse(){
  //Convert API response to string and removes commas
  var cleanArray = logArray.toString().replace(/,/g, "");
  //Uses FS NPM to pass API response with line breaks in utf8 encoding
  fs.appendFile('log.txt', "Response:\r\n" + cleanArray + "\r\n", 'utf8', function(err) {    
    // If an error was experienced we say it.
    if(err){
      console.log(err);
    }
    // If no error is experienced, we'll log the phrase "Content Added" to our node console. 
    else {
      console.log("Content Added!");
    }
  })
}

//Runs Twitter tweets search
function tweets(){
  //Query Twitter API for tweets from specific screen name (limited to 20)
  twit.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=adamfader&count=20', function(error, tweets, response){
    //Check if there was no error
    if(!error){
      //Loop through returned tweets and log them to the console
      for(i = 0; i < tweets.length; i++){
        console.log(tweets[i].user.screen_name + ' said: ' + tweets[i].text);
        logArray.push(tweets[i].user.screen_name + ' said: ' + tweets[i].text + "\r\n");
      }
      userInput2 = "No screen name specified";
      appendCommand(); //append command to log.txt
      appendResponse(); //append tweets to log.txt
    }else{
      //if error occurs, log it to the console
      console.log(error);
    }
  });
}

//Runs Spotify track search
function spotty(){
  //Query Spotify API for track name
  spotify.search({ type: 'track', query: userInput2 }, function(err, data) {
    //if an error occurs, log the error and stop executing
    if (err){
      console.log('Error occurred: ' + err);
      return;
    }
    //Each part of the response data is logged in the console
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].preview_url);
    //Pushes each part of the response data to an array (new lines are added to each for readability)
    logArray.push(data.tracks.items[0].artists[0].name + "\r\n");
    logArray.push(data.tracks.items[0].name + "\r\n");
    logArray.push(data.tracks.items[0].album.name + "\r\n");
    logArray.push(data.tracks.items[0].preview_url + "\r\n");
    //console.log(logArray);
    //Run functions that append the responses and commands to log.txt
    appendCommand();
    appendResponse();
  });
}

function movie(){

  // Then run a request to the OMDB API with the movie specified
  request('http://www.omdbapi.com/?t=' + userInput2 + '&tomatoes=true&y=&plot=short&r=json', function (error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode == 200) {
      //Each part of the response body is logged in the console 
      console.log("Title: " + JSON.parse(body)["Title"]);
      console.log("Year: " + JSON.parse(body)["Year"]);
      console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"])
      console.log("Country: " + JSON.parse(body)["Country"])
      console.log("Plot: " + JSON.parse(body)["Plot"])
      console.log("Actors: " + JSON.parse(body)["Actors"])
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"])
      console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"])
      //Pushes each part of the response body to an array (new lines are added to each for readability)
      logArray.push("Title: " + JSON.parse(body)["Title"] + "\r\n");
      logArray.push("Year: " + JSON.parse(body)["Year"] + "\r\n");
      logArray.push("IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\r\n");
      logArray.push("Country: " + JSON.parse(body)["Country"] + "\r\n");
      logArray.push("Plot: " + JSON.parse(body)["Plot"] + "\r\n");
      logArray.push("Actors: " + JSON.parse(body)["Actors"] + "\r\n");
      logArray.push("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\r\n");
      logArray.push("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"] + "\r\n");
      //Run functions that append the responses and commands to log.txt
      appendCommand();
      appendResponse();
    }
  });
}

function randCommand(){
  // This block of code will read from the "random.txt" file.
  // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
  // The code will store the contents of the reading inside the variable "data" 
  fs.readFile("random.txt", "utf8", function(error, data) {
      // We will then print the contents of data
      console.log(data);
      // Then split it by commas (to make it more readable)
      var dataArr = data.split(',');
      // We will then re-display the content with the split for aesthetics.
      //console.log(dataArr);
      userInput1 = dataArr[0];
      userInput2 = dataArr[1];
      //check which command was retrieved from random.txt and call appropriate function
      //dones this way incase random.txt is changed to movie command
      if(userInput1 == 'spotify-this-song'){
        spotty();
      }else if(userInput1 == 'movie-this'){
        movie();  
      }
  });
}