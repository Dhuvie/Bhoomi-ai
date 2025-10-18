# AgriVision AI

This is a Next.js starter project created in Firebase Studio.

## Running the Project Locally

Follow these steps to download and run your application on your local machine.

### 1. Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) (version 20 or later) installed on your computer. This will also install `npm`, the Node.js package manager.

### 2. Download Your Code

Download your project files as a ZIP archive from the Firebase Studio interface and unzip them in your desired location.

### 3. Setup Guide: Google Cloud Project & API Keys (CRITICAL STEP)

This project **WILL NOT WORK** without an API key for Gemini. This guide will walk you through creating a project, enabling billing, and getting the required key.

#### **Part A: Create a New Google Cloud Project**

1.  **Go to the Google Cloud Console:** Open your browser and navigate to the [Google Cloud Project Creator](https://console.cloud.google.com/projectcreate).
2.  **Enter a Project Name:** Give your project a memorable name, like `AgriVision-AI-Project`.
3.  **Select a Billing Account (If prompted):** If you already have a billing account, you can select it here. 
4.  **Click "Create":** Wait for a few moments as Google provisions your new project.
5.  **Ensure Project is Selected:** Once created, make sure your new project's name is visible at the top of the Google Cloud console. If not, click the project selector dropdown at the top and choose it.

#### **Part B: Get Your Gemini API Key**

This key is for the AI features in the app.

1.  **Go to Google AI Studio:** In a new browser tab, navigate to [Google AI Studio's API Key page](https://aistudio.google.com/app/apikey).
2.  **Create API Key:** Click the **"Create API key in new project"** button.
3.  **Copy the Key:** A new key will be generated. Click the copy icon next to it.

#### **Part C: Add Keys to Your `.env.local` File**

1.  **Create the File:** In the root directory of your unzipped AgriVision AI project code, create a new file named `.env.local`.
2.  **Add the Keys:** Paste your copied keys into this file, exactly as shown below:

    ```
    # Used for all AI features (Genkit/Gemini).
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

3.  **Save the file.**

    **IMPORTANT:** After creating or changing this file, you must **stop and restart your local development server** for the changes to take effect.

### 4. Install Dependencies and Run

1.  Open a terminal or command prompt and navigate to your project's root directory.
2.  Install the necessary packages by running:

    ```bash
    npm install
    ```

3.  Once the installation is complete, start the local development server:

    ```bash
    npm run dev
    ```

4.  Open your web browser and go to [http://localhost:9002](http://localhost:9002) to see your application running! All AI features should now be functional.