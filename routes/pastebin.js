exports.getLink = function(req, res, next) {
    console.log('getlink POST recieved')
    console.log(req.body)
    res.send({
        message: "recieved"
    });
}