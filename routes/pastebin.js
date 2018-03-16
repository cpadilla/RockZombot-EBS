exports.getLink = function(req, res, next) {
    console.log('getlink POST recieved')

    // TODO make request to pastebin api
    res.send({
        link: "https://pastebin.com"
    });
}