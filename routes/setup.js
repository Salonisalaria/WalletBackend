var express = require('express');
var randomize = require('randomatic');
var wallet = require('../db/wallet');

var router = express.Router();

router.post('/', (req, res) => {
    // Prepare data for create wallet
    let newWallet = new wallet({
        name: req.body.name,
        balance: Number.parseFloat(req.body.balance).toFixed(4),
        transactionId: randomize('A0', 10),
        createdAt: new Date(),
    });

    // Trigger save wallet data in DB
    newWallet.save()
    .then(data => {
        console.log(data);
        resData = {
            id: data._id,
            name: data.name,
            balance: data.balance,
            transactionId: data.transactionId,
            createdAt: data.createdAt,
        };
        res.send(JSON.stringify(resData));
    })
    .catch(err => {

        resErrData = {
        }

        if(err.code == 11000) {
            resErrData.errMsg = "Username already exists !!!";
        } else  {
            resErrData.errMsg = "We are facing some internal issues, please try after some time !!!";
        }
        res.status(500).json(resErrData);
    });
});

module.exports = router;