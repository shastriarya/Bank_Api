const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/acccount.model")
const emailservice = require("../services/email.service");
const mongoose = require("mongoose")

/**
 * Create a new transaction
 *
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */


/**
 * Validate request
 */
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "FromAccount ToAccount, Amount, idempotencyKey is required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  /**
   *  Validate idempotency key
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists === "FAILED") {
      return res.status(500).json({
        message: "Transaction processinf failed previouly, Please retry",
      });
    }

    if (isTransactionAlreadyExists === "REVERSED") {
      return res.status(500).json({
        message: "Trasaction was reversed, please retry",
      });
    }
  }

  /**
   * 3. Check account status
   */
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both FromAccount and ToAccount must be active to process transaction",
    });
  }

  /**
   * 4. Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance} requested amout id ${amount}`,
    });
  }


  let transaction;
  try{
    
  
  /**
   *  5. Create transaction (PENDING)
   */

  const session = await mongoose.startSession();
  session.startTransaction();

   transaction = new transactionModel(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    
  );

  const debitLedgerEntry = await ledgerModel.create([
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    }],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
  [  {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    }],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  }catch(error){
  //   await transactionModel.findOneAndUpdate({ idempotencyKey: idempotencyKey },{status:"FAILED"});
  //   return res.status(500).json({
  //     message:"Transaction Failed due to internal Error",
  //     error : error.message
  //   })

  return res.status(400).json({
    message:"Transaction is PENDING due to some issue, please try after some time"
  })

  }



  /**
   *  10. Send email notification
   */

  await emailservice.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount) 

  return res.status(201).json({
    message:"Transaction completed succesfully",
    transaction:transaction
  })


}


/**
 * -post /api/transaction/system/initial-fund
 * -Create inital funds transaction from system User 
 */

async function createInirialFundsTransaction(req,res){
  const {toAccount,amount,idempotencyKey} = req.body;

  if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:"ToAccount Amount And IdempotencyKay is required"
    })
  }

  const toUserAccount = await accountModel.findOne({
    _id:toAccount
  })

  if(!toUserAccount){
    return res.status(400).json({
      message:"Ivalid Account"
    }) 

  }

  const fromUserAccount = await accountModel.findOne({
    user:req.user._id
  })

  if(!fromUserAccount){
    return res.satus(400).json({
      message:"System user Account Not Found"
    })
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create([{
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING",

  }],{session})

  const debitLedgerEntry = (await ledgerModel.create([{
    account:fromUserAccount._id,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"

  }],{session}))[0]

  await(()=>{
    return new Promise((resolve) => setTimeOut(resolve,100*1000))
  })

  const creditLedgerEntry = await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
  }],{session})

  await transactionModel.findOneAndUpdate(
    {_id:transaction._id},
    {status:"COMPLETED"},
    {session}
  )

  await session.commitTransaction()
  session.endSession()

  return res.status(201).json({
    message:"Initial funds transaction completed succescesfully"
  })
}



module.exports = {
  createTransaction,
  createInirialFundsTransaction,
};