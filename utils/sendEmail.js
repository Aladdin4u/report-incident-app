const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config/.env" });
const email = process.env.AUTHUSER;
const password = process.env.AUTHPASSWORD;

const sendEmail = async (receiver, subject, message) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: email,
    //     pass: password,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "passwordreset@report.com",
      to: receiver,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;
