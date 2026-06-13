const sgMail = require("@sendgrid/mail");

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const fromName = process.env.SENDGRID_FROM_NAME || "Your App";

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

const ensureSendGridConfig = () => {
  if (!sendgridApiKey) {
    throw new Error("Thieu SENDGRID_API_KEY");
  }

  if (!fromEmail) {
    throw new Error("Thieu SENDGRID_FROM_EMAIL");
  }
};

const sendEmail = async ({ to, subject, html, text, from = fromName }) => {
  ensureSendGridConfig();

  await sgMail.send({
    from: {
      email: fromEmail,
      name: from,
    },
    to,
    subject,
    text,
    html,
  });
};

// ================= OTP =================
const sendOTP = async (email, otp, subject = "Ma OTP xac thuc") => {
  await sendEmail({
    to: email,
    subject,
    text: `Ma OTP cua ban la: ${otp}. OTP co hieu luc trong 5 phut.`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Xac thuc OTP</h2>
        <p>Ma OTP cua ban la:</p>
        <h1 style="color: #0d6efd;">${otp}</h1>
        <p>OTP co hieu luc trong 5 phut</p>
      </div>
    `,
  });
};

// ================= WARNING =================
const sendWarningEmail = async (email, message) => {
  await sendEmail({
    to: email,
    subject: "Canh bao bao mat",
    text: `${message}\nNeu day khong phai ban, hay doi mat khau ngay!`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color:red;">Canh bao bao mat</h2>
        <p>${message}</p>
        <p>Neu day khong phai ban, hay doi mat khau ngay!</p>
      </div>
    `,
    from: "Security Alert",
  });
};

module.exports = { sendOTP, sendWarningEmail };
