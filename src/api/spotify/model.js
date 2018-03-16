const nunjucks = require('nunjucks')
const axios = require('axios')
const { StringUtils } = require('../../utils')
const Model = require('../../model')

class SpotifyModel extends Model {
    constructor({ name, Connection }) {
        super({ name })
    }

    async getSong({ song }) {
        song = StringUtils.encodeString(song)
        const options = {
            url: `https://api.spotify.com/v1/search?q=${song}&type=track&market=us&limit=1`,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        }

        const { tracks: { items } } = JSON.parse(await axios(options).then(({ data }) => data))
        const [track] = items
        const newOptions = { 
            ...options,
            url: 'https://api.spotify.com/v1/me/player/play',
            method: 'put',
            data: { uris: [track.uri] }
        }

        await axios(newOptions) // check if can play with success

        return track
    }
}

module.exports = exports = new SpotifyModel({ name: 'Spotify' })
