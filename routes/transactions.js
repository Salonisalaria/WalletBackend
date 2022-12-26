var express = require('express');
const { count } = require('../db/transaction');
var transaction = require('../db/transaction');

var router = express.Router();

router.get('/', (req, res) => {
    let resData = {

    }

    transaction.find({
        walletId: req.query.walletId,
    }).skip(req.query.skip).limit(req.query.limit)
    .then(data => {
        transaction.countDocuments({
            walletId: req.query.walletId,
        }, (err, count) => {
            resData.total = count;
            resData.data = data;
            res.send(JSON.stringify(resData));
        });
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    });
});

module.exports = router;