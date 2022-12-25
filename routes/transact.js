var express = require('express');
var randomize = require('randomatic');
var wallet = require('../db/wallet');
var transaction = require('../db/transaction');

var router = express.Router();

router.post('/:walletId', (req, res) => {

    let newTransaction = new transaction({
        walletId: req.params.walletId,
        transactionId: randomize('A0', 10),
    });

    wallet.findOne({
        _id: req.params.walletId,
    }).then(data => {
        if(req.body.amount > 0 || (req.body.amount < 0 && data.balance >= -1 * req.body.amount)) {
            newTransaction.transactionAmout = req.body.amount < 0 ? -1 * req.body.amount: req.body.amount;
            newTransaction.transactionType = req.body.amount < 0 ? 'debit' : 'credit';
            newTransaction.transactionDescription = req.body.description;

            wallet.findOneAndUpdate({
                _id: req.params.walletId,
            }, {
                $inc: {balance: req.body.amount}, 
            }, {
                new: true,
                runValidators: true,
            }).then(data => {
                newTransaction.balanceAmount = data.balance;
                newTransaction.transactionStatus = 'success';
                newTransaction.createdAt = new Date();
                newTransaction.save()
                .then(data => {
                    let resData = {
                        balance: data.balanceAmount,
                        transactionId: data.transactionId
                    }
                    res.send(JSON.stringify(resData));
                })
                .catch(err => {
                    console.log(err);
                    let resData = {
                        balance: data.balanceAmount,
                        transactionId: data.transactionId,
                        errMsg: "Failed to save transaction details due to internal issues, please contact the app owner !!!"
                    }
                    res.send(JSON.stringify(resData));
                });
            }).catch(err => {
                console.log(err);
                newTransaction.transactionStatus = 'failure';
                newTransaction.createdAt = new Date();
                let resData = {
                    balance: data.balance,
                    errMsg: 'Transaction Failed due to Internal Issues !!!',
                };
                res.send(JSON.stringify(resData));
            });
        } else {
            newTransaction.transactionAmout = req.body.amount < 0 ? -1 * req.body.amount: req.body.amount;
            newTransaction.transactionType = req.body.amount < 0 ? 'debit' : 'credit';
            newTransaction.transactionDescription = req.body.description;
            newTransaction.balanceAmount = data.balance;
            newTransaction.transactionStatus = 'failed';
            newTransaction.createdAt = new Date();
            newTransaction.save();
            
            let resData = {
                balance: data.balance,
                errMsg: 'Invalid Transaction due to low balance or transaction amount 0 !!!',
            };
            res.send(JSON.stringify(resData));
        }
    }).catch(err => {
        console.log(err);
        let resData = {
            balance: 0,
            errMsg: 'Transaction Failed',
        };
        res.send(JSON.stringify(resData));
    });
});

module.exports = router;