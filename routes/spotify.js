const express = require('express'); // Express web server framework
const router = express.Router();
const spotify = require('../Spotify/swrapper.js')

router.get('playSong/:song', function(req, res, next){
    console.log("playSong");
    console.log("parameters: ", req.params);
});

module.exports = router;