const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index: true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating aledger entry"],
        immuatble:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger is must be associated with a transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either CREDIT or DEBIT"
        },
        required:[true,"Ledger type is required"],
        immuatble:true
    }
})

function preventLedgerMofication(){
    throw new Error("Ledger entries are immuatble and cannot be modified oe deleted");
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerMofication);
ledgerSchema.pre('updateOne',preventLedgerMofication);
ledgerSchema.pre('deleteOne',preventLedgerMofication);
ledgerSchema.pre('remove',preventLedgerMofication);
ledgerSchema.pre('findOneAndDelete',preventLedgerMofication); 
ledgerSchema.pre('deleteMany',preventLedgerMofication); 
ledgerSchema.pre('findOneAndReplace',preventLedgerMofication); 


const ledgerModel = mongoose.model("ledger",ledgerSchema);
module.exports = ledgerModel;