var PastebinAPI = require('pastebin-js')

exports.getLink = function(req, res, next) {
    console.log('getlink POST recieved')

    // TODO move key to a config
    var pastebin = new PastebinAPI('c2782b965a1788ff8fd954b3f30d8b52')

    // Requet Pastebin link from API
    pastebin.createPaste(req.body.pasteString, "", req.body.syntaxHighlighting, 0)
    .then(function(data) {
        console.log(data)

        res.send({
            link: data + ""
        });
    })
    .fail(function(err) {
        console.log(err)

        res.send({
            link: "error"
        });
    })
}