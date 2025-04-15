# React-Electron Admin Desktop App

This is a desktop application built for the **admin panel** of the **Accompanying Friend Project**. The app is built using **Vite**, **React**, and **Electron**, providing a smooth user experience for managing the project's registration data.

## Features
- **Admin Panel**: A desktop interface for admins to manage project data.
- **Electron Integration**: Runs as a desktop application, leveraging Electron for cross-platform compatibility.
- **Vite Development**: Fast development environment using Vite.
- **React Components**: The user interface is built using React components for smooth interactivity.

## Technologies
- **Vite**: A modern build tool for faster development and optimized production builds.
- **React**: JavaScript library for building user interfaces.
- **Electron**: Framework to build cross-platform desktop applications using web technologies.
  
## Prerequisites
Before running the app, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

## Getting Started

Follow these steps to run the application locally:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd  './accompanying-friend-final-project/React-Electron-Deskstop-App'
   ```

2. **Install dependencies**:

   Install the necessary dependencies using npm:

   ```bash
   npm install
   ```

3. **Build the app for production**:

   To create a production build of the app, run:

   ```bash
   npm run build
   ```

   This will generate optimized build files that can be packaged and distributed.    


4. **Run the app in development mode**:

   To start the development environment, run the following commands in two separate terminal windows:

   - **Start the React app**:

     ```bash
     npm run dev:react
     ```

   - **Start Electron**:

     Make a production build (step 3) and then run:
       
     ```bash
     npm run dev:electron
     ```
   
   This will open the app in Electron with live-reloading enabled for React during development.

## Commands

- `dev:react`: Starts the Vite development server for the React app.
- `dev:electron`: Starts the Electron app and loads the React app.
- `build`: Builds the production-ready version of the app.
- `start`: Builds the production-ready version of the app, then Starts the Electron app.