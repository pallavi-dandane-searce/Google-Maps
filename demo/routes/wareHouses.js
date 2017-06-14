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
    var filter = req.filter;
    var collection = db.get(req.query['dbToSearchFor']);
    delete req.query['dbToSearchFor'];
    console.log(req.query);

    collection.find(req.query,{},function(e,docs){
        res.json(docs);
    });
});

router.get('/getData', function(req, res) {
    var db = req.db;
//    var dbName = req.query.dbName;
    var collection = db.get('metadata');

    collection.find(req.query,{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;
