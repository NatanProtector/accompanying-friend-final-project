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
