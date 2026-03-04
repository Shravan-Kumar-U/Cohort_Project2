const { Router } = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");
const accountRouter = Router();


//To get balance from the user(Random value)
accountRouter.get("/balance", authMiddleware, async (req, res) => {
    const ammount = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: ammount.balance
    })
})

// Transaction part(Important)
// To Transfer the money from one user to another user
accountRouter.post("/tranfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    // The above line code will make user that either all of them execute or none of them execute
    session.startTransaction();
    const { ammount, to } = req.body;

    const fromAccount = await Account.findOne({
        userId: req.userId
    }).session(session)
    
    if(!fromAccount || fromAccount.balance < ammount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({
        userId: to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -ammount }}).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: ammount }}).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });

})

module.exports = {
    accountRouter
}