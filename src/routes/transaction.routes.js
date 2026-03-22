const {Router} = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")
const transactionRoutes = Router();

/**
 * POST /api/trasactions
 * Create new transaction
 */

transactionRoutes.post(
  "/",
  authMiddleware.authSystemUserMiddleware,
  transactionController.createTransaction,
);

/**
 * POST /api/transactions/system/initial-fund
 * Create initial fund transaction from system user
 */
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInirialFundsTransaction)

module.exports=transactionRoutes;