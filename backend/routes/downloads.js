const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Available downloads with metadata
const downloads = {
  "accompanying-friend.apk": {
    name: "Accompanying Friend Mobile App",
    description: "React Native cross-platform mobile application for Android devices",
    version: "1.0.0",
    size: "25.4 MB",
    type: "application/vnd.android.package-archive",
    filePath: "downloads/accompanying-friend.apk",
  },
  "admin-app-windows.exe": {
    name: "Desktop Admin App",
    description: "Electron-based desktop administration tool for Windows",
    version: "1.0.0",
    size: "45.2 MB",
    type: "application/vnd.microsoft.portable-executable",
    filePath: "downloads/admin-app-windows.exe",
  },
};

// Get all available downloads
router.get("/list", (req, res) => {
  try {
    const downloadList = Object.keys(downloads).map((filename) => ({
      filename,
      ...downloads[filename],
    }));

    res.json({
      success: true,
      data: downloadList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching download list",
      error: error.message,
    });
  }
});

// Download a specific file
router.get("/:filename", (req, res) => {
  try {
    const { filename } = req.params;

    // Check if file exists in our downloads list
    if (!downloads[filename]) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const fileInfo = downloads[filename];
    const filePath = path.join(__dirname, "..", "public", fileInfo.filePath);

    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Log download attempt (you could save this to database)
    console.log(
      `Download requested: ${filename} by IP: ${
        req.ip
      } at ${new Date().toISOString()}`
    );

    // Set appropriate headers for download
    res.setHeader("Content-Type", fileInfo.type);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", fs.statSync(filePath).size);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error streaming file",
        });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing download",
      error: error.message,
    });
  }
});

// Get download statistics (example endpoint)
router.get("/stats/overview", (req, res) => {
  try {
    // This is a mock response - in a real application, you'd query a database
    const stats = {
      totalDownloads: 1250,
      mostDownloaded: "accompanying-friend.apk",
      downloadsToday: 45,
      downloadsThisWeek: 234,
      downloadsThisMonth: 892,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching download statistics",
      error: error.message,
    });
  }
});

module.exports = router;
