const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/**
 * -Routes
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes")

/**
 * -Use Routes rquired
 */
app.use("/api/auth", authRouter);
app.use("/api/accounts",accountRouter);


/**
 * Transaction route
 * POST 
 */

    app.use("/api/transactions",transactionRouter);

module.exports = app;
