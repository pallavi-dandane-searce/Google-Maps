/**
 * Created by pallavidandane on 14/6/17.
 */
var express = require('express');
var router = express.Router();

/*
 * GET wareHouseslist.
 */
router.get('/templates', function(req, res) {
    var db = req.db;
    var collection = db.get('templates');

    collection.distinct('docType',{},function(err, items) {
        res.json(items);
    });
});

/*
 * GET wareHouseslist.
 */
router.get('/templatesFields', function(req, res) {
    console.log('here');
    var db = req.db;
    var collection = db.get('templates');
    console.log(req.query);

    collection.find(req.query,{},function(err, items) {
        console.log('here');
        console.log(err);
        console.log(items);
        res.json(items);
    });
});
module.exports = router;