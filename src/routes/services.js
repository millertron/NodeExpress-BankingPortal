const express = require("express");
const { accounts, writeJSON } = require("../data");

const router = express.Router({});

router.get('/transfer', (req, res) => res.render('transfer'));
router.post('/transfer', (req, res) => {
    const fromBalance = parseInt(accounts[req.body.from].balance, 10);
    const toBalance = parseInt(accounts[req.body.to].balance, 10);
    const transferAmount = parseInt(req.body.amount, 10);

    accounts[req.body.from].balance = fromBalance - transferAmount;
    accounts[req.body.to].balance = toBalance + transferAmount;

    writeJSON();
    res.render('transfer', { message: "Transfer Completed" });
});

router.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
router.post('/payment', (req, res) => {
    const creditBalance = parseInt(accounts.credit.balance, 10);
    const creditAvailable = parseInt(accounts.credit.available, 10);
    const amount = parseInt(req.body.amount, 10);

    accounts.credit.balance = creditBalance - amount;
    accounts.credit.available = creditAvailable + amount;

    writeJSON();
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

module.exports = router;
