const spot = require('./swrapper.js')

spot.playSong("get down with the sickness").then(function (e){console.log(e)}).catch(function (error){console.log(error)});
