exports.render = function(req, res) {
    var path = require('path');
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
};