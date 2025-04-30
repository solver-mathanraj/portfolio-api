const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://portfolio-blush-rho-93.vercel.app/", // only allow your frontend
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// Configure real email (e.g., Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL, // your Gmail address
    pass: process.env.PASS, // use Gmail App Password, not your regular password
  },
});

// POST route to send email
app.post("/send", async (req, res) => {
  const { user_name, user_email, subject, message } = req.body;

  try {
    const mailOptions = {
      from: `"${user_name}" <${user_email}>`,
      to: process.env.USER_EMAIL,
      subject: subject
        ? "Msg from Portfolio: " + subject
        : "New Message from Portfolio Contact Form",
      html: `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#f9f9f9;border:1px solid #ddd;padding:20px;border-radius:8px;color:#333;">
    <h2 style="text-align:center;color:#ff688c;">📨 New Message from Your Website</h2>

    <table style="width:100%;margin-top:20px;">
      <tr>
        <td style="padding:8px 0;"><strong>👤 Name:</strong></td>
        <td>${user_name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;"><strong>📧 Email:</strong></td>
        <td>${user_email}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;"><strong>📝 Subject:</strong></td>
        <td>${subject}</td>
      </tr>
    </table>

    <div style="margin-top:30px;">
      <strong>💬 Message:</strong>
      <div style="background:#fff;border:1px solid #ccc;padding:15px;border-radius:5px;margin-top:10px;white-space:pre-line;">
        ${message.replace(/\n/g, "<br/>")}
      </div>
    </div>

    <p style="margin-top:40px;font-size:12px;color:#777;text-align:center;">
      This message was sent from your website's contact form.  
    </p>
  </div>
  `,
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed to send" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
