const accountModel = require("../models/acccount.model");

async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res, next) {
    const accounts = await accountModel.find({
        user:req.user._id
    });

   if(accounts){
     res.status(200).json({});
   }
}

async function getAccountBalanceController(req,res,next){
    const {accountId} = req.params;

    const account = await accountModel.findOne({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:"Account Not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance:balance
    })
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
};
