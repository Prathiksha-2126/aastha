# Aastha: AI-Driven Social Infrastructure 🌿

**Aastha** is a state-of-the-art coordination platform designed to bridge the gap between community needs and humanitarian response. Built for the **Google Solution Challenge**, it leverages the full power of the Google Cloud ecosystem to create a forensically transparent, AI-driven social infrastructure.

---

## 🚀 Core Intelligence: Powered by Google

Aastha is not just a dashboard; it is an intelligence engine built on the **Google Cloud Vertex AI** platform.

### 🧠 Gemini 1.5 Flash (LLM)
*   **Multi-modal Ingestion**: Processes field-recorded audio and imagery simultaneously.
*   **Need Extraction**: Instantly transforms unstructured multilingual voice reports into structured JSON data.
*   **Vision Analysis**: Analyzes field photos to provide instant emergency precautions and life-saving tips to volunteers.
*   **Causal Inference**: Synthesizes longitudinal data to provide urban planners with research-grade insights.

### ☁️ Google Cloud Services
*   **Vertex AI**: Host for the Gemini 1.5 Flash models ensuring enterprise-grade scalability.
*   **Speech-to-Text**: High-accuracy multilingual ingestion (Hindi, Marathi, Konkani, English).
*   **Cloud Translation**: Real-time normalization of field reports for centralized administrative coordination.

### 🔥 Firebase (Google Cloud Firestore)
*   **Real-Time Ledger**: All community signals, volunteer locations, and intervention outcomes are stored in a cryptographically hashed Firestore database.
*   **Instant Sync**: Ensures that a report filed on the **Mobile App** appears on the **Coordinator Portal** in less than 200ms.

---

## 🛠️ Platform Components

### 1. Coordinator Portal (Web)
*   **Compass Map**: A real-time geospatial hub for tracking active units and neglected community nodes.
*   **Equity & Impact Lab**: A forensic workspace for monitoring geographic bias (SDG 10) and accessing the **Geospatial History Archive**.
*   **Impact Hearth**: A verified reporting dashboard for causal attribution and on-chain transparency.

### 2. Volunteer Gateway (Mobile)
*   **Echo Field Hub**: A multi-modal reporting tool for voice and vision-based signal ingestion.
*   **Direct Coordination**: Integrated WhatsApp and Voice Call links for zero-latency deployment.
*   **AI Chat Assistant**: On-demand field guidance powered by Gemini AI.

---

## 💻 Tech Stack
*   **Frontend**: React (Coordinator Portal), TailwindCSS (Styling).
*   **Mobile**: React Native (Field App), Lucide Icons.
*   **Backend**: FastAPI (Python), Uvicorn.
*   **Cloud**: Google Cloud Platform (Vertex AI, STT, Translation), Firebase (Firestore).

---

## 🏁 Getting Started

### Prerequisites
*   Python 3.9+
*   Node.js 16+
*   Google Cloud Service Account with Vertex AI and STT enabled.

### Installation
1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
2. **Web Portal**:
   ```bash
   cd react-app
   npm install
   npm start
   ```
3. **Mobile App**:
   ```bash
   cd mobile-app
   npm install
   npx expo start
   ```

---

**Aastha** — *Turning community signals into verifiable human impact.*
