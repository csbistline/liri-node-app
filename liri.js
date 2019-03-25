// ===================================
// REQUIRED FILES AND GLOBAL VARIABLES
// ===================================

require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
moment().format();
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var args = process.argv;

// WHAT ACTION SHOULD BE PERFORMED?
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`
var action = args[2];
var target = args[3];

switch (action) {
    case "concert-this":
        concertthis(target);
        break;

    case "spotify-this-song":
        spotifythissong(target);
        break;

    case "concert-this":
        moviethis(target);
        break;

    case "concert-this":
        dowhatitsays();
        break;

    default:
        break;
}

// ==================================
// FUNCTIONS
// ==================================

function concertthis(artistName) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    // console.log(queryURL);
    // make axios request to bandsintown api
    axios
    .get(queryURL)
    .then(function (response) {        
        var artistInfo = response.data
        // console.log(artistInfo);
        var concert;

        for (concert in artistInfo) {
            console.log(artistInfo[concert].datetime);
            console.log(artistInfo[concert].venue);

        }
        
    })

    // error handling
    .catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
    });




}

function spotifythissong(songName) {
    console.log("Spotify", songName);
    
}

function moviethis(movieName) {
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryURL);

}

function dowhatitsays() {
    console.log("Do What it says in random.txt");
    
}

