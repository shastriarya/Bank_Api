require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Arya Bank-server" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail, name){
  const subject = "🎉 Welcome to Arya Bank Server";

  const text = `Hello ${name},

Thank you for registering at Arya Bank Server.
We’re excited to have you on board!

Best Regards,
Arya Bank Server Team`;

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 40px 0;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(90deg, #1e3c72, #2a5298); padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">Arya Bank Server</h1>
    </div>

    <div style="padding: 30px;">
      <h2 style="color: #333;">Hello ${name}, 👋</h2>
      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Thank you for registering with <strong>Arya Bank Server</strong>.
        We’re thrilled to welcome you to our secure banking platform.
      </p>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Your account has been successfully created. You can now explore
        all the powerful features designed to manage your finances efficiently.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background: #2a5298; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Go to Dashboard
        </a>
      </div>

      <p style="color: #777; font-size: 14px;">
        If you did not create this account, please ignore this email.
      </p>
    </div>

    <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #777;">
      © 2026 Arya Bank Server. All rights reserved.
    </div>

  </div>
</div>
`;

  await sendEmail(userEmail, subject, text, html );
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "💸 Money Transfer Successful | Arya Bank Server";

  const text = `Hello ${name},

Your transaction has been completed successfully.

Transaction Details:
- Amount Transferred: ₹${amount}
- Sent To Account: ${toAccount}

Thank you for using Arya Bank Server.

If you did not authorize this transaction, please contact support immediately.

Best Regards,
Arya Bank Server Team`;

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 40px 0;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
    
    <div style="background: linear-gradient(90deg, #11998e, #38ef7d); padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">Arya Bank Server</h1>
      <p style="color: #eafff5; margin-top: 6px;">Transaction Confirmation</p>
    </div>

    <div style="padding: 30px;">
      <h2 style="color: #333;">Hello ${name}, 👋</h2>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        Your money transfer was <strong>successful</strong>. Below are the transaction details:
      </p>

      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0;"><strong>Transferred Amount:</strong> ₹${amount}</p>
        <p style="margin: 8px 0;"><strong>Receiver Account:</strong> ${toAccount}</p>
      </div>

      <p style="color: #777; font-size: 14px;">
        If you did not make this transaction, please notify us immediately.
      </p>
    </div>

    <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #777;">
      © 2026 Arya Bank Server. All rights reserved.
    </div>

  </div>
</div>
`;

  await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    
}
