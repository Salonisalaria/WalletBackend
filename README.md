# Live URL
https://concrete-brook-shingle.glitch.me

# Setup Project

In order to setup the project follow the below steps
- RUN `npm install`
- RUN `nodemon app.js`
- After running the above program, your project will start running on your local machine
- Here we are using nodemon, as nodemon helps to refresh the project status on each change made to the Node project








# Endpoints:

1. Setup Wallet Endpoint: It is a POST api endpoint, used for wallet creation

**REQUEST:**
curl --location --request POST 'http://localhost:8080/setup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "balance": "20000.4444",
    "name": "Alex"
}'

**ERROR RESPONSE:**
{
    "errMsg": "Username already exists !!!"
}

**SUCCESS RESPONSE:**
{"id":"63a8dd633e7676989abc5803","name":"Alex","balance":20000.4444,"transactionId":"NGCALFZLWV","createdAt":"2022-12-25T23:31:47.844Z"}


2. Credit Debit Wallet Endpoint: Used for making transactions from the wallet

**REQUEST:**
curl --location --request POST 'http://localhost:8080/transact/63a3510b88c2acc31620fd85' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": "100000",
    "description": "Recharge"
}'

**ERROR RESPONSE:**
{"balance":2000100000.4444,"errMsg":"Invalid Transaction due to low balance or transaction amount 0 !!!"}

**SUCCESS RESPONSE:**
{"balance":100000,"transactionId":"7JEMUTFTEH"}


3. Get Transaction Enpoint: This endpoint is used to get a list of the transactions

**REQUEST:**
curl --location --request GET 'http://localhost:8080/transactions?walletId=63a217183cfa7fa356ba9767&skip=0&limit=0' \
--data-raw ''

**RESPONSE:**
[
    {
        "_id": "63a2fa995a3b06cac849bcdd",
        "walletId": "63a217183cfa7fa356ba9767",
        "transactionId": "ZVS15QLTP0",
        "transactionAmout": 100000,
        "transactionType": "credit",
        "transactionDescription": "Recharge",
        "balanceAmount": 2000400000.4444,
        "transactionStatus": "success",
        "createdAt": "2022-12-21T12:22:49.322Z",
        "__v": 0
    },
    .
    .
    .
]


4. Get Wallet Endpoint: Used to get wallet details with the help of wallet ID

**REQUEST:**
curl --location --request GET 'http://localhost:8080/wallet/63a8dd633e7676989abc5803' \
--data-raw ''

**RESPONSE:**
{
    "id": "63a8dd633e7676989abc5803",
    "balance": 20000.4444,
    "name": "Alex",
    "date": "2022-12-25T23:31:47.844Z"
}


5. Login Endpoint: Helps the user to login using the username

**REQUEST:** 
curl --location --request POST 'http://localhost:8080/wallet/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Alex"
}'

**ERROR RESPONSE:**
{"errMsg":"User not found !!!"}

**SUCCESS RESPONSE:**
{"id":"63a8dd633e7676989abc5803","balance":20000.4444,"name":"Alex","date":"2022-12-25T23:31:47.844Z"}








# DB Structure:

Here we have used two collections:

1. transaction DB 

**Schema:**

walletId: String,
transactionAmout: Number,
transactionId: String,
transactionType: String,
transactionStatus: String,
transactionDescription: String,
balanceAmount: Number,
createdAt: Date,

- In the above DB we are storing the wallet ID in order to show transaction for a particular wallet ID
- Transaction Amount is being stored as that needs to be shown in the statement (being passed from FE)
- Transaction ID is an auto generated ID, in order to identify a unique transaction
- Transaction Type says whether it is a credit or debit transaction, will be helpful if in future, we need to query for credit and debit transactions
- Transaction Status says whether the transaction was successful or failure
- Transaction Desscription is passed from FE
- Balance Amount calculated at the time of updating balance after transaction and stored, will be helpful while generating statement
- Created At stores the date of transaction

2. wallet DB 

**Schema:**

name: { type: String, unique: true},
balance: Number,
transactionId: String,
createdAt: Date,

- In the above table the, _id which is auto generated will be used as the wallet id
- Name is a unique element, as usernames can't be same
- Balance amount is the current balance in the wallet
- Transaction ID is an auto generated ID, in order to identify a unique transaction
- Created At date states the date of creation of wallet








# Queries:

1. We are using .save() methods to store new objects for wallet and transaction
   Usages
   - Save transaction
   - Save wallet details

2. We are using .findOne({_id: req.params.walletId}), to search a wallet based on wallet
   Also the reason to use findOne is because no two wallets can have the same id, hence better to use findOne

3. We are using
    findOneAndUpdate({
        _id: req.params.walletId,
    }, {
        $inc: {balance: req.body.amount}, 
    }, {
        new: true,
        runValidators: true,
    })
    The above query, updated the wallet details by id. The above query increased the balance field by the specified amount
    Also please note, as in debit tranasaction we are receiving transaction amount in negative values, hence we perform
    the increment, and get the final value
    The `new: true` option provided, returns the object after the update
    Also findOneAndUpdate helps to avoid race conditions, as it doesn't allow object access when findOneAndUpdate is using
    the data

4. We are also using .find(), to find transactions for a given wallet
   The query is also accompanied by .skip(req.query.skip).limit(req.query.limit)
   The above helps to skip certain number of records from the start and get the next n records
