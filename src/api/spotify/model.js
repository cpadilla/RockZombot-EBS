const axios = require('axios')
const { StringUtils } = require('../../utils')
const Model = require('../../model')
const token = "BQA_cRUinhRWTdMiheAaCnrqm-B9NeF6bd-EXH6SpQxzk5bvVWXsJS8PZDTK-nzR3O9UGSO1y3Msb0MTlDzek6G6ZrEU0ox0pct2u0ai68VCEsHOSw5F5JOF7FpkVknTMnO-dmsJR0RDnu9qDak5q2sRmwpQK6OM0piPFANGv-xMpT5ClbVhtuy-fk7btSSzAqmuitoqewzBKTnY5FDOUIkcc9aEKyfx1w2QxwGQ32HDkfW567T7"
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
