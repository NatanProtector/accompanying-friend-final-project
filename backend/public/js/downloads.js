// Downloads functionality for Accompanying Friend website

class DownloadManager {
  constructor() {
    this.downloadButtons = document.querySelectorAll(".download-button");
    this.init();
  }

  init() {
    this.setupDownloadButtons();
    this.setupDownloadTracking();
  }

  setupDownloadButtons() {
    this.downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleDownload(e);
      });
    });
  }

  async handleDownload(e) {
    e.preventDefault();

    const button = e.target;
    const downloadUrl = button.getAttribute("href");
    const fileName = downloadUrl.split("/").pop();

    try {
      // Show loading state
      this.showLoadingState(button);

      // Track download attempt
      await this.trackDownload(fileName);

      // Trigger download
      this.triggerDownload(downloadUrl, fileName);

      // Show success message
      this.showSuccessMessage(button, fileName);
    } catch (error) {
      console.error("Download error:", error);
      this.showErrorMessage(button);
    }
  }

  showLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = "Downloading...";
    button.disabled = true;
    button.style.opacity = "0.7";

    // Store original text for restoration
    button.dataset.originalText = originalText;
  }

  restoreButton(button) {
    button.textContent = button.dataset.originalText;
    button.disabled = false;
    button.style.opacity = "1";
  }

  async trackDownload(fileName) {
    try {
      // You could send analytics data to your server here
      console.log(`Download started: ${fileName}`);

      // Example: Send to your analytics endpoint
      // await fetch('/api/analytics/download', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ fileName, timestamp: new Date().toISOString() })
      // });
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  }

  triggerDownload(url, fileName) {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showSuccessMessage(button, fileName) {
    const originalText = button.textContent;
    button.textContent = "Download Complete!";
    button.style.background = "#28a745";

    setTimeout(() => {
      this.restoreButton(button);
    }, 2000);
  }

  showErrorMessage(button) {
    const originalText = button.textContent;
    button.textContent = "Download Failed";
    button.style.background = "#dc3545";

    setTimeout(() => {
      this.restoreButton(button);
    }, 3000);
  }

  setupDownloadTracking() {
    // Track download statistics
    this.updateDownloadStats();
  }

  async updateDownloadStats() {
    try {
      const response = await fetch("/api/downloads/stats/overview");
      const data = await response.json();

      if (data.success) {
        this.displayStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching download stats:", error);
    }
  }

  displayStats(stats) {
    // You could display download statistics on the page
    console.log("Download statistics:", stats);

    // Example: Update a stats section if it exists
    const statsElement = document.getElementById("download-stats");
    if (statsElement) {
      statsElement.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-item">
                        <h3>${stats.totalDownloads}</h3>
                        <p>Total Downloads</p>
                    </div>
                    <div class="stat-item">
                        <h3>${stats.downloadsToday}</h3>
                        <p>Downloads Today</p>
                    </div>
                    <div class="stat-item">
                        <h3>${stats.downloadsThisWeek}</h3>
                        <p>Downloads This Week</p>
                    </div>
                </div>
            `;
    }
  }
}

// File size formatter
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Download progress indicator
function showDownloadProgress(fileName) {
  const progressDiv = document.createElement("div");
  progressDiv.className = "download-progress";
  progressDiv.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p>Downloading ${fileName}...</p>
    `;

  document.body.appendChild(progressDiv);

  // Simulate progress (in real implementation, you'd track actual progress)
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    const fill = progressDiv.querySelector(".progress-fill");
    fill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.body.removeChild(progressDiv);
      }, 1000);
    }
  }, 200);
}

// Initialize download manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DownloadManager();
});

// Export for use in other scripts
window.DownloadManager = DownloadManager;
