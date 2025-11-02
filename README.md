<div align="center">
  <img src="public/favicon.ico" alt="Bhoomi Logo" width="120" />

  # Bhoomi AI

  **Next-Generation Field Intelligence and AI Agronomy Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-Flash_1.5-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  *Empowering precision agriculture through real-time analytics, machine learning algorithms, and intuitive system design.*
</div>

---

<div align="center">
  <img src="public/screenshots/hero.png" alt="Bhoomi AI Dashboard Overview" width="100%" style="border-radius: 12px; box-shadow: 0px 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

## 1. Executive Summary

Bhoomi is an enterprise-grade, artificial intelligence-powered agricultural intelligence platform explicitly designed to bridge the operational gap between traditional farming methodologies and modern data science. By leveraging state-of-the-art vision models and utilizing deeply localized agronomic datasets, Bhoomi delivers highly precise, actionable insights directly to agricultural stakeholders. The primary objective is to optimize crop yields, minimize resource waste, and proactively manage agronomic risks through predictive modeling.

---

## 2. Core Capabilities

The platform is built upon several foundational pillars designed to maximize agricultural output and sustainability:

- **Yield Forecasting and Analytics**
  Harnesses extensive localized environmental datasets, soil health indicators (NPK and pH levels), and specific crop growth stages to predict harvest yields with substantial statistical accuracy. This module utilizes historical market trends to provide comprehensive financial forecasts.

- **Computer Vision Diagnostics**
  Provides instantaneous, real-time disease and pest identification using Google Gemini Vision models. Users can capture photographic evidence of crop anomalies and receive immediate, localized, and actionable treatment protocols derived from vast agronomic databases.

- **Intelligent Soil Management**
  Facilitates advanced soil parameter analysis. By inputting baseline nutrient metrics, the system dynamically generates crop suitability matrices and customized fertilizer regimens, thereby optimizing soil health and minimizing chemical run-off.

- **Multilingual Voice Interface**
  Features a sophisticated natural language processing engine that allows users to interact with the platform using spoken commands in English, Hindi, Odia, or Telugu. The system instantly translates complex agricultural queries and provides concise, strictly formatted responses.

- **User Experience and Interface Architecture**
  Engineered with a high-performance dark mode aesthetic, incorporating smooth transitions and tactile feedback mechanisms to ensure seamless operation even in challenging field conditions.

---

## 3. Visual Interface Showcase

The Bhoomi interface is designed for maximum clarity, data density, and operational efficiency.

<table align="center" style="border-collapse: collapse; border: none; width: 100%;">
  <tr>
    <td align="center" width="50%" style="border: none; padding: 10px;">
      <b>Command Center Dashboard</b><br/>
      <img src="public/screenshots/dashboard.png" alt="Global Dashboard" width="100%" style="border-radius: 8px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);"/>
      <br/><i>Centralized telemetry and system overviews.</i>
    </td>
    <td align="center" width="50%" style="border: none; padding: 10px;">
      <b>Field Tracking Module</b><br/>
      <img src="public/screenshots/fields.png" alt="Field Management" width="100%" style="border-radius: 8px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);"/>
      <br/><i>Individualized parcel monitoring and historical tracking.</i>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%" style="border: none; padding: 10px;">
      <b>Diagnostic Analysis Interface</b><br/>
      <img src="public/screenshots/diagnose.png" alt="AI Leaf Diagnosis" width="100%" style="border-radius: 8px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);"/>
      <br/><i>Real-time computer vision analysis results.</i>
    </td>
    <td align="center" width="50%" style="border: none; padding: 10px;">
      <b>Agronomic Analytics</b><br/>
      <img src="public/screenshots/insights.png" alt="Yield Insights" width="100%" style="border-radius: 8px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);"/>
      <br/><i>Predictive modeling and statistical breakdowns.</i>
    </td>
  </tr>
  <tr>
    <td align="center" width="100%" colspan="2" style="border: none; padding: 10px;">
      <b>Market Intelligence Feed</b><br/>
      <img src="public/screenshots/market.png" alt="Market Prices" width="50%" style="border-radius: 8px; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);"/>
      <br/><i>Real-time commodity pricing and economic forecasting.</i>
    </td>
  </tr>
</table>

---

## 4. Technical Architecture

Bhoomi relies on a scalable, serverless architecture optimized for high availability and low latency data processing.

* **Core Framework**: Next.js (App Router paradigm) enabling hybrid static and server-rendered operations.
* **Artificial Intelligence Engine**: Google Gemini API (specifically the 1.5 Flash model) powers the platform.
  * *Vision Tasks*: Processes localized crop imagery for immediate pathogen detection.
  * *Natural Language Processing*: Advanced prompt engineering structures complex, multi-variable contexts (weather telemetry, soil metrics, voice inputs) into standardized JSON agronomy plans.
* **Frontend Infrastructure**: Radix primitives combined with Tailwind CSS for highly performant, accessible, and responsive interface components.
* **Language Specification**: Strictly typed utilizing TypeScript to ensure codebase integrity and reduce runtime anomalies.

---

## 5. Deployment and Installation

To initialize the platform locally, the following technical prerequisites must be met.

### Prerequisites
- Node.js (Version 18.0.0 or higher)
- A valid Google Gemini API Authentication Key

### Initialization Sequence

1. **Clone Repository and Install Dependencies**
   Execute the package manager to resolve and install all necessary project dependencies.
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Establish the local environment configuration file to securely inject the API credentials.
   ```bash
   echo "GEMINI_API_KEY=your_secure_api_key_here" > .env.local
   ```

3. **Initialize Development Server**
   Boot the Next.js development server to compile the application and commence local hosting.
   ```bash
   npm run dev
   ```

The application will immediately bind to port 3000 and can be accessed via `http://localhost:3000`.

---

<div align="center">
  <br/>
  <sub>Engineered with precision for the future of agricultural technology.</sub>
</div>
