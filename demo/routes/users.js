var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/wareHouses', function(req, res) {
    var db = req.db;
    var collection = db.get('wareHouses');
//    console.log(collection);
//    console.log('++==============');

    collection.find({},{},function(e,docs){
//        console.log(docs);
        res.json(docs);
    });
});

module.exports = router;
