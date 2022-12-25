var mongoose = require('mongoose');

var walletSchema = new mongoose.Schema({
    name: { type: String, unique: true},
    balance: Number,
    transactionId: String,
    createdAt: Date,
});

var wallet = mongoose.model('wallets', walletSchema);


module.exports = wallet;