var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    walletId: String,
    transactionAmout: Number,
    transactionId: String,
    transactionType: String,
    transactionStatus: String,
    transactionDescription: String,
    balanceAmount: Number,
    createdAt: Date,
});

var transaction = mongoose.model('transactions', transactionSchema);

module.exports = transaction;