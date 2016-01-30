exports.render = function(req, res) {
    res.render('index', {
        title: 'Galactic Conquest',
        menuText: 'Please select your game view',
        boardOnly: 'board only',
        boardHand: 'board and hand',
        handOnly: 'hand only'
    })
};