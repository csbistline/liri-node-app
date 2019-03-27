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
var fs = require("fs");
var args = process.argv;

// WHAT ACTION SHOULD BE PERFORMED?
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`
var action = args[2];
var target = args[3];


function doWhat(action, target) {
    switch (action) {
        case "concert-this":
            concertthis(target);
            break;

        case "spotify-this-song":
            spotifythissong(target);
            break;

        case "movie-this":
            moviethis(target);
            break;

        case "do-what-it-says":
            dowhatitsays();
            break;

        default:
            console.log("Hmmm ... I don't understand.");
            break;
    }
};

// ==================================
// FUNCTIONS 
// ==================================

function concertthis(artistName) {
    // * Returns the following from Bands in Town Artist Events API
    // * Name of the venue
    // * Venue location
    // * Date of the Event (use moment to format this as "MM/DD/YYYY")

    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    // console.log(queryURL);
    // make axios request to bandsintown api
    axios
        .get(queryURL)
        .then(function (response) {
            var artistInfo = response.data
            var concert;
            console.log("\n=============================");
            console.log("Upcoming " + artistName + " concerts");
            console.log("=============================");

            for (concert in artistInfo) {
                var dates = artistInfo[concert].datetime.split("T");
                var concertDate = moment(dates[0]).format('LL')
                var venue = artistInfo[concert].venue;

                console.log("\n=====================");
                console.log(concertDate);
                console.log(venue.name);
                console.log(venue.city + " " + venue.region + " " + venue.country);
                console.log("=====================");
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
};

function spotifythissong(songName) {
    // * Returns the following from the Spotify API
    // * Artist(s)
    // * The song's name
    // * A preview link of the song from Spotify
    // * The album that the song is from

    if (!songName) {
        console.log("No song specified... enjoy some Ace of Base");
        songName = "The Sign"
    }
    console.log("Searching Spotify for: " + songName + "\n");

    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            // This is where the magic happens            
            var albums = response.tracks.items;
            var i;
            for (i in albums) {
                // console.log(albums[i]);
                var info = albums[i];
                console.log("==================");
                console.log("Artist: " + info.artists[0].name);
                console.log("Song: " + info.name);
                console.log("Album: " + info.album.name);
                console.log("Preview: " + info.preview_url);
                console.log("Full album: " + info.external_urls.spotify);
                console.log("==================\n");
            }
        })
        .catch(function (err) {
            // console.log(err);
            console.log("Couldn't find that...");

        });
};

function moviethis(movieName) {

    if (!movieName) {
        console.log("No movie specified... You're getting a Jared Leto movie instead.");
        movieName = "Mr. Nobody"
    }
    console.log("Searching Spotify for: " + movieName + "\n");

    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //     * Returns the following from the OMDB API
    //     * Title of the movie.
    //     * Year the movie came out.
    //     * IMDB Rating of the movie.
    //     * Rotten Tomatoes Rating of the movie.
    //     * Country where the movie was produced.
    //     * Language of the movie.
    //     * Plot of the movie.
    //     * Actors in the movie.
    //   ```

    axios
        .get(queryURL)
        .then(function (response) {
            var movie = response.data
            // console.log(movie);

            console.log("==================");
            console.log("Movie: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("Actors: " + movie.Actors);
            console.log(movie.Ratings[0].Source + " rating: " + movie.Ratings[0].Value);
            console.log(movie.Ratings[1].Source + " rating: " + movie.Ratings[1].Value);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("==================\n");
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
};

function dowhatitsays() {
    console.log("Do What it says in random.txt...\n");
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // separate out the action and target from the info in random
        var args = data.split(", ");
        doWhat(args[0], args[1])
    })
};

// start the process
doWhat(action, target);