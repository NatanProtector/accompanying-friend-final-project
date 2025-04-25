const express = require("express");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const router = express.Router();

// GET /recaptcha/recaptcha-render - Renders the reCAPTCHA HTML page
router.get("/recaptcha-render", (req, res) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.error("RECAPTCHA_SITE_KEY not found in environment variables.");
    return res.status(500).send("Server configuration error.");
  }

  const recaptchaHtmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      <style>
        body, html {
          height: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .g-recaptcha {
          transform-origin: center;
        }
      </style>
    </head>
    <body>
      <form>
        <div class="g-recaptcha" data-sitekey="${siteKey}" data-callback="onVerify"></div>
      </form>
      <script>
        function onVerify(token) {
          window.ReactNativeWebView.postMessage(token);
        }
      </script>
    </body>
  </html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(recaptchaHtmlContent);
});

// POST /recaptcha/verify-recaptcha - Verifies the reCAPTCHA token
router.post("/verify-recaptcha", async (req, res) => {
  const { token } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is missing." });
  }

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY not found in environment variables.");
    return res
      .status(500)
      .json({ success: false, message: "Server configuration error." });
  }

  try {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${encodeURIComponent(
        secretKey
      )}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();

    if (data.success) {
      // Token is valid
      console.log("reCAPTCHA verification successful:", data);
      res
        .status(200)
        .json({ success: true, message: "reCAPTCHA verified successfully." });
    } else {
      // Token is invalid
      console.log("reCAPTCHA verification failed:", data);
      res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed.",
        errorCodes: data["error-codes"],
      });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA token:", error);
    res
      .status(500)
      .json({ success: false, message: "Error verifying reCAPTCHA token." });
  }
});

module.exports = router;
