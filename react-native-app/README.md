# **Accompanying Friend React App**

_A React Native mobile application for college final project._

---

## **Getting Started**

### **📱 Download the App**

Ready to use the app? Download the latest versions from our official website:

[Download from Website](https://accompanying-friend-final-project.onrender.com/)

### **Prerequisites**

1. **Install Node.js**  
   Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

2. **Install Expo CLI**  
   Install Expo CLI globally if you haven't already:
   ```bash
   npm install -g expo-cli
   ```

---

### **Setup**

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/accompanying-friend.git
   cd accompanying-friend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

---

### **Run the App**

1. Start the Expo development server using either of these commands:

   - Using npm:
     ```bash
     npm start
     ```
   - Using npx:
     ```bash
     npx expo start
     ```

2. Choose your preferred method to run the app:
   - **Virtual Mobile Device**:  
     If you have an emulator (like Android Studio or Xcode Simulator) open, press `a` to load the app automatically on the device.
   - **Physical Device**:  
     Scan the QR code using the Expo Go app (available on iOS and Android) to open the app.
   - **Web Browser**:  
     Press `w` in the terminal to open the app in your web browser.

---

### **To create an internal distribution build**

Log in to expo using the cli tool and then:

```bash
eas build -p android --profile preview
```

## **Development Status**

The app is **currently under development** and includes:

- Static screens.
- Basic navigation for demonstration purposes.

Future updates will focus on adding dynamic content and enhancing features.

---

## **Scripts**

- `npm start`: Starts the Expo development server.
- `npx expo start`: An alternative way to start the Expo development server.
