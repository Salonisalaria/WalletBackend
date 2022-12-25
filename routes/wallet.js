var express = require('express');
var wallet = require('../db/wallet');

var router = express.Router();

router.get('/:id', (req, res) => {
    wallet.findOne({
        _id: req.params.id,
    })
    .then(data => {
        let resData = {
            id: req.params.id,
            balance: data.balance,
            name: data.name,
            date: data.createdAt, 
        };
        res.send(JSON.stringify(resData));
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.post('/login', (req, res) => {
    wallet.findOne({
        name: req.body.name,
    })
    .then(data => {
        let resData = {
            id: data._id,
            balance: data.balance,
            name: data.name,
            date: data.createdAt, 
        };
        res.send(JSON.stringify(resData));
    })
    .catch(err => {
        resData = {
            errMsg: "User not found !!!"
        };
        res.status(500).send(JSON.stringify(resData));
    });
});


module.exports = router;