const request = require('request-promise');

var token = "";  //Place token here

module.exports = {
  playSong: function getSong(song){
//If the string has spaces, replace space with %20
    if(song.indexOf(' ') >= 0){
      var parsed_song = song.replace(/ /g,"%20")
      song = parsed_song;
      //console.log("Parsed Song: " + parsed_song);
    }
//Options for get song request
    var options = {
      url: `https://api.spotify.com/v1/search?q=${song}&type=track&market=us&limit=1`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
    return promise = new Promise(function (resolve, reject){
      request(options).then(function(data){
        var trackInfo = JSON.parse(data);
//Options for play song on device request note: adding: ?device:<device> has issues
        var options_new = {
          url: "https://api.spotify.com/v1/me/player/play",
          method: "PUT",
          json: { "uris": [trackInfo.tracks.items[0].uri]},
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        request(options_new).then(function(success) {
            resolve(trackInfo.tracks.items[0])
        }).catch(function(error) {
            reject("Second Request Error" + error)
        })
        //resolve(trackInfo.tracks.items[0].uri);
      }).catch(function(error){
        reject("First Request Error" + error);
      });
    });
  },

  //Depricated ignore
  play: function play(){

    return promise = new Promise(function(resolve, reject){
      request(options_new).then(function(success){resolve(success)}).catch(function(error){reject(error)});
    });
  },
  nextSong: function nextSong(){
    var options = {
      url: "https://api.spotify.com/v1/me/player/next",
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    return promise = new Promise(function(resolve, reject){
      request(options).then(function(data){resolve(data)}).catch(function(error){reject(error)});
    });
  }
}
