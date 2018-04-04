const axios = require('axios')
const { StringUtils } = require('../../utils')
const Model = require('../../model')
const token = 'BQAVWIjd9hqDnphhLYhodPn__gHKLeAvFjtqgVxIpCFVLCnsC1LjksMDe1Aq8pCOS24oUHmr5mI2o74GYHiZhRK3EeN3cXHmNRvaH-aVwDKLtRRq_zG2PM9XDvn3DezMURixIrMfvl6U8VQtOMqeiUGnZv0JDvHR9f5dtQCy7q6QaqO6k_N1ipfjwJoMDPPWkEr-LiWVQIBKppz3AVlf43_ILVkr5Awy9Qaucy6Z7U9ufXC5n4XkXu4CiPm_kRP7T1xmxTE'

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

        const { tracks: { items } } = await axios(options).then(({ data }) => data)
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
