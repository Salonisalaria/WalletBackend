// Exported Modules
var express = require('express');
var mongoose = require('mongoose');

// Variables
var app = express();
var port = 8000;
var mongoDB = 'mongodb+srv://salonisalaria2699:Mongodb2607@cluster0.cruzbn8.mongodb.net/highlevelwallet';

// Middlewares
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
mongoose.set('strictQuery', false);

// Establish connection to database
mongoose.connect(mongoDB);
mongoose.connection.on('connected', (err) => {
    console.log('DB Connection Success !!!');
});
mongoose.connection.on('error', (err) => {
    console.log('DB Connection Error: ' + err);
});

// Setup routes
app.use('/setup', require('./routes/setup'));
app.use('/transact', require('./routes/transact'));
app.use('/transactions', require('./routes/transactions'));
app.use('/wallet', require('./routes/wallet'));

app.listen(process.env.PORT || port,  () => {console.log(`Listening on port ${port}`)});
