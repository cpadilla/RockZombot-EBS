const spot = require('./swrapper.js')

spot.playSong("gummo").then(function (e){console.log(e)}).catch(function (error){console.log(error)});
