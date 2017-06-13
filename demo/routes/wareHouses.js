var express = require('express');
var router = express.Router();

/*
 * GET wareHouseslist.
 */
router.get('/wareHouses', function(req, res) {
    var db = req.db;
    var collection = db.get('wareHouses');

    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/filter', function(req, res) {
    var db = req.db;
    console.log(req.query);
    var filter = req.filter;
    var collection = db.get('wareHouses');

    collection.find(req.query,{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;
