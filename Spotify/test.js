const spot = require('./swrapper.js');

spot.playSong("omg usher").then(function (e){console.log(e);}).catch(function (error){console.log(error);});
