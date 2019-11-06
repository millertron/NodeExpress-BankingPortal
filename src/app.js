const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( {extended: true }));

const accountData = fs.readFileSync("src/json/accounts.json", { encoding: "UTF8" });
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync("src/json/users.json", { encoding: "UTF8"});
const users = JSON.parse(userData);

app.get('/', (req, res) => res.render('index', { title: 'Account Summary', accounts: accounts }));
app.get('/savings', (req, res) => res.render('account', { account: accounts.savings }));
app.get('/checking', (req, res) => res.render('account', { account: accounts.checking }));
app.get('/credit', (req, res) => res.render('account', { account: accounts.credit }));
app.get('/profile', (req, res) => res.render('profile', { user: users[0] }));
app.get('/transfer', (req, res) => res.render('transfer'));
app.post('/transfer', (req, res) => {
    const fromBalance = parseInt(accounts[req.body.from].balance, 10);
    const toBalance = parseInt(accounts[req.body.to].balance, 10);
    const transferAmount = parseInt(req.body.amount, 10);

    accounts[req.body.from].balance = fromBalance - transferAmount;
    accounts[req.body.to].balance = toBalance + transferAmount;

    const accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, { encoding: "utf8"});

    res.render('transfer', { message: "Transfer Completed" });
});
app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
app.post('/payment', (req, res) => {
    const creditBalance = parseInt(accounts.credit.balance, 10);
    const creditAvailable = parseInt(accounts.credit.available, 10);
    const amount = parseInt(req.body.amount, 10);

    accounts.credit.balance = creditBalance - amount;
    accounts.credit.available = creditAvailable + amount;

    let accountsJSON = JSON.stringify(accounts, null, 4);
    fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, { encoding: "utf8"});

    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

app.listen(3000, () => console.log('PS Project Running on Port 3000!'));