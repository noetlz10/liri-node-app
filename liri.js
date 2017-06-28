//Required Variables/Dependencies
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var twitterKeys = keys.twitterKeys;

// //input variables
var userInput = process.argv[2];
var alternateUserInput = process.argv[3];

// console.log('Enter "my-tweets", "spotify-this-song", "movie-this" or "do-what-it-says"');

// //**********SWITCH CASE COMMAND**********

switch (userInput) {
    case 'my-tweets':
        twitterFunction();
        break;

    case 'spotify-this-song':
        spotifyFunction();
        break;

    case 'movie-this':
        movieFunction();
        break;

        case 'do-what-it-says':
        doWhatItSaysFunction();
        break;

    default:
        console.log("Enter 'myTwitter', 'spotifyThisSong', 'movie-this', or 'do-what-it-says'");
}


//This is the function to be called when user inputs node app.js my-tweets.  This function will pull 20 twitter posts and print them in the terminal
function twitterFunction() {
    //for user based authentication.  Var client now holds the twitter keys that are stored in keys.js
    var client = new twitter(twitterKeys);
    //passing the endpoint and parameters.
    client.get("statuses/user_timeline", { count: 20 }, function(error, tweets, response) {
        if (!error)
        //object"tweets".methodName"forEach"--->using forEach method to execute the function
            tweets.forEach(function(tweet) {
            //console.logging tweet text, creation time, times favorited, times retweeted
            console.log(tweet.text);
            console.log("created: " + tweet.created_at);
            console.log("favorited: " + tweet.favorite_count + " times");
            console.log("retweeted: " + tweet.retweet_count + " times");
            console.log("***********************************");
        });
    })
    //the user input will append to the log.txt file(ex. my tweets)
    fs.appendFile("log.txt", ", " + userInput);
}


// process for spotify-this-song command
function spotifyFunction() {


    var songSearch = (process.argv.slice(3).join(" ") || "I Want It That Way");

    var spotify = new Spotify({
        id: '955f0e850ba9400594a646ba34549152',
        secret: '72354b10508947fa98db066ee52fd00b'
    });

    spotify.search({ type: 'track', query: songSearch }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else if (songSearch != "I Want It That Way") {
            console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
            console.log("Track Name: " + data.tracks.items[0].name);
            console.log("Preview URL: " + data.tracks.items[0].preview_url);
            console.log("Album Name: " + data.tracks.items[0].album.name);

           } else {
                console.log("Artist Name: " + data.tracks.items[4].artists[0].name);
                console.log("Track Name: " + data.tracks.items[4].name);
                console.log("Preview URL: " + data.tracks.items[4].preview_url);
                console.log("Album Name: " + data.tracks.items[4].album.name);
            }
        
    });

//log this command in the log.txt file
fs.appendFile("log.txt", "spotify-this-song," + songSearch, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("You've logged a spotify-this-song command in the log.txt file!");
        }
    })

}


// This function will have the user enter a movie title and pull information which will print to the terminal.
function movieFunction() {
    //console.log when entering the function
    var movieName = (process.argv.slice(3).join("+") || "mr.nobody");

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country/Countries where the movie was produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        }
    })

//log this command in the log.txt file
fs.appendFile("log.txt", "movie-this," + movieName, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("You've logged a movie-this command in the log.txt file!");
        }
    })

}


// // //Function needed for Do-what-it-says
function doWhatItSaysFunction() {
    fs.readFile("random.txt", "utf8", function(error, body) {
        console.log(body);
        var bodyArr = body.split(",");
        if (bodyArr[0] === "my-tweets"){
            twitterFunction();
        } else if (bodyArr[0] === "spotify-this-song"){
            spotifyFunction();
        } else if (bodyArr[0] === "movie-this"){
            movieFunction();
        }

        })
    //The user input will append to the log.txt file(ex. do-what-it-says + my tweets)
    fs.appendFile("log.txt", ", " + userInput + " " +alternateUserInput);
    };