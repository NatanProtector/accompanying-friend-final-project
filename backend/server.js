const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { getMongoURI } = require("./utils/env_variables");
const routes = require("./routes/index");
const { addSocketsToServer } = require("./sockets/sockets");

dotenv.config();

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json());

// http://127.0.0.1:3001/recaptcha
// http://localhost:3001/recaptcha

app.get("/recaptcha", (req, res) => {
  console.log("recaptcha");
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
          transform: scale(1.2); /* Adjust scale as needed */
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
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(recaptchaHtmlContent);
});

app.use("/api", routes);

// Serve a test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Adding Socket.io
const server = addSocketsToServer(app);

mongoose
  .connect(getMongoURI())
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
