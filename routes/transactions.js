var express = require('express');
var transaction = require('../db/transaction');

var router = express.Router();

router.get('/', (req, res) => {
    resData = 

    transaction.find({
        walletId: req.query.walletId,
    }).skip(req.query.skip).limit(req.query.limit)
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    });
});

module.exports = router;