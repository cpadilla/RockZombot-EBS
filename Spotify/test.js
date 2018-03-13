const spot = require('./swrapper.js')

spot.playSong("faxing berlin").then(function (e){console.log(e)}).catch(function (error){console.log(error)});
