const fs = require('fs');
const path = require('path');
const { accounts, users, writeJSON } = require('./data');

const express = require('express');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( {extended: true }));

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

    writeJSON();
    res.render('transfer', { message: "Transfer Completed" });
});
app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
app.post('/payment', (req, res) => {
    const creditBalance = parseInt(accounts.credit.balance, 10);
    const creditAvailable = parseInt(accounts.credit.available, 10);
    const amount = parseInt(req.body.amount, 10);

    accounts.credit.balance = creditBalance - amount;
    accounts.credit.available = creditAvailable + amount;

    writeJSON();
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});


app.listen(3000, () => console.log('PS Project Running on Port 3000!'));