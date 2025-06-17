# Accompanying Friend

-----

Accompanying Friend is a **security tool** designed to enhance safety and provide peace of mind when navigating potentially dangerous terrain. This project, developed as a final capstone for our software engineering bachelor's degree, includes a cross-platform mobile application, a desktop administration tool, and a robust Node.js backend.

## 📱 Mobile App

The Accompanying Friend **cross-platform mobile app**, built with **React Native**, serves as the primary interface for users. It provides secure functionalities for:

  * **Account Management:** Users can easily **register, log in, and recover their accounts**.
  * **Bot Protection:** Google reCAPTCHA and Webview integrations safeguard the registration process from automated attacks.
  * **Email Verification & Admin Approval:** Account registration requires confirmation via **EmailJS** for email verification, followed by **manual approval from administrators**, ensuring authenticated and validated user accounts.
  * **User Roles:** Users can register as either **Security Users** (requiring appropriate certificates) or **Citizen Users** (using an ID photo for verification).
  * **Navigation & Event Reporting (Citizen Users):** Once logged in, Citizen Users can utilize the app as a navigation tool that displays **dangerous events and terrain**. In an emergency, they can **report events**, which instantly notifies active Security Users.
  * **Emergency Response (Security Users):** Active Security Users receive **notifications and prompts to navigate to reported event locations**, enabling rapid response.

Here are some screenshots of the mobile app's user interface:

#### Login And Registration
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0019.jpg?raw=true" alt="Mobile App Captcha" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0020.jpg?raw=true" alt="Mobile App Login Screen" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0016.jpg?raw=true" alt="Mobile App Role Select Register Screen" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0018.jpg?raw=true" alt="Mobile App Register Screen" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0017.jpg?raw=true" alt="Mobile App User Dashboard" width="300">

#### Navigation Screen
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0011.jpg?raw=true" alt="Mobile App Navigation" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0014.jpg?raw=true" alt="Mobile App Navigation Search" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0013.jpg?raw=true" alt="Mobile App Drive" width="300">
<img src="https://github.com/NatanProtector/accompanying-friend-final-project/blob/small-visual-changes/screenshots/IMG-20250616-WA0012.jpg?raw=true" alt="Mobile App Report Event" width="300">

-----

## 💻 Desktop Admin App

The Accompanying Friend **desktop application**, built with **Electron and React**, is an **exclusive tool for administrators**. This closed application is strictly for approved personnel and provides:

  * **Admin Login:** Secure access for authorized administrators.
  * **User Approval Dashboard:** A comprehensive list of users awaiting approval, along with their registration information.
  * **Live User Map:** A real-time map displaying the live locations of all active users.
  * **Manual Event Reporting:** Admins can manually report events on the map based on intel, directing security users to critical areas.

Here are some screenshots of the desktop admin application's user interface:

  * *(Insert Screenshot 4: Desktop Admin Login)*
  * *(Insert Screenshot 5: Desktop Admin User Approval Dashboard)*
  * *(Insert Screenshot 6: Desktop Admin Live User Map with Event Reporting)*

-----

## 🌐 Node.js Server

The **Node.js server** acts as the central **gateway for all API requests** within the Accompanying Friend ecosystem. It handles:

  * **Real-time Communication:** Coordinates the live display of user locations to administrators using **Socket.IO**.
  * **Data Management:** Manages all user registrations, account data, and event information, storing it securely in **MongoDB Atlas**.

-----

## 🔒 Security Measures (Prototype)

This project is currently a **prototype** and is intended to demonstrate core functionalities rather than serve as a production-ready system with robust security. However, it incorporates the following foundational security measures:

  * **Anti-Cross-Site Scripting (XSS):** Measures are in place to mitigate XSS vulnerabilities.
  * **JWT Session Authentication:** JSON Web Tokens (JWT) are used for secure session management.

-----

## 🚀 Running the Project

Please note that this project is **closed for contribution** as it is our final academic project. Instructions for running the application are not publicly available.

-----

## 📖 More Documentation

For a more in-depth look at the project, including additional photos and detailed architecture diagrams, please visit the **[Accompanying Friend Wiki Page](https://github.com/NatanProtector/accompanying-friend-final-project/wiki)**.

-----

## ✒️ Authors

  * [Natan Protector](https://github.com/NatanProtector)
  * [Evyatar Ben Chayun](https://github.com/Evyatarbe)