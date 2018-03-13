const spotify = require('../Spotify/swrapper.js')

exports.playSong = function(req, res, next){
    console.log("playSong");
    console.log("parameters: ", req.params);

    var song = req.params.song;

    spotify.playSong(song).then( function (e) {
        console.log(e)
    }).catch( function (error) {
        console.log(error)
    });
};

