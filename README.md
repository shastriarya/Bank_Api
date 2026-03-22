# Bank Transaction Backend

A Node.js backend application for managing bank transactions, user accounts, and authentication.

## Description

This project provides a RESTful API for a banking system, allowing users to register, authenticate, manage accounts, and perform transactions. It includes features like secure authentication with JWT, transaction processing with ledger management, and email notifications.

## Features

- User registration and login with JWT authentication
- Account management
- Secure transaction processing with idempotency keys
- Ledger system for tracking account balances
- Email notifications for registrations and transactions
- Token blacklisting for logout
- Cookie-based authentication

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Email**: Nodemailer
- **Other**: Cookie-parser, dotenv for environment variables

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd bank_transaction
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongo_url
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. Start the server:
   - For development: `npm run dev`
   - For production: `npm start`

## Usage

The server will run on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Accounts

- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create a new account

### Transactions

- `POST /api/transactions` - Create a new transaction

## Database

The application uses MongoDB. Ensure you have a MongoDB instance running and update the `MONGODB_URI` in the `.env` file.

## Project Structure

```
src/
├── app.js                 # Main application setup
├── config/
│   └── db.js              # Database connection
├── controllers/           # Route handlers
│   ├── auth.controller.js
│   ├── account.controller.js
│   └── transaction.controller.js
├── middleware/
│   └── auth.middleware.js # Authentication middleware
├── models/                # Mongoose models
│   ├── user.model.js
│   ├── acccount.model.js  # (Note: Typo in filename)
│   ├── transaction.model.js
│   ├── ledger.model.js
│   ├── blackList.model.js
├── routes/                # API routes
│   ├── auth.routes.js
│   ├── account.routes.js
│   └── transaction.routes.js
└── services/
    └── email.service.js   # Email service
server.js                  # Server entry point
package.json               # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.
