const request = require('request-promise')

var token = ""  //Place your spotify token here
module.exports = {
  playSong: function getSong(song){
    if(song.indexOf(' ') > 0){
      song.replace(" ", "%20")
    }
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
        //console.log(trackInfo.tracks.items[0].uri);
        var options_new = {
          url: "https://api.spotify.com/v1/me/player/play",
          method: "PUT",
          json: { "uris": [trackInfo.tracks.items[0].uri]},
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        request(options_new).then(function(success){resolve("Request Succesfully Sent!")}).catch(function(error){reject(error)})
        //resolve(trackInfo.tracks.items[0].uri);
      }).catch(function(error){
        reject(error);
      });
    });
  },
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
