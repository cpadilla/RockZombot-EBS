const Model = require('./model')

module.exports = { getSong }

/**
* @api {get} /spotify/getSong/:song Get a song from spotify
* @apiDescription Gets a specific song from spotify.
* @apiGroup Spotify
* @apiVersion 0.0.1
* @apiParam {String} song Specifies the song name to fetch from spotify.
*
* @apiUse defaultSuccessProperties
* @apiUse defaultErrorProperties
* @apiSuccess {Object} data Returns a the song info object.
*
* @apiUse defaultErrorExample
*/
async function getSong(req, res, next) {
    const { song } = req.params
    try {
        const songInfo = await Model.getSong({ song })
        res.reply(songInfo)
    } catch (err) {
        next(err)
    }
}
