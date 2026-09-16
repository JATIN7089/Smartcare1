# SmarTCARE — "Cognitive Care for Brighter Tomorrows"

**Play • Recall • Stay Connected • Live Better**

- **Team:** Phantom techie
- **Hackathon:** SMART INDIA HACKATHON 2026
- **Problem Statement ID:** 26003
- **Problem Statement:** AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)
- **Ministry / Organization:** Ministry of Development of North Eastern Region (MDoNER)
- **Theme:** Healthcare, Biomedical Devices & Assistive Technology (Software)

---

## 🌟 Overview & Product Positioning

**SmarTCARE** is a complete, working, offline-first assistive cognitive engagement and memory companion web application engineered specifically for elderly seniors, family caregivers, and community healthcare workers (CHOs/ASHAs) across the eight states of the North Eastern Region (NER) of India:
*Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, and Sikkim.*

> **Ethical & Medical Safety Policy:**  
> SmarTCARE is a supportive cognitive engagement and memory assistance platform. It does **not** diagnose, predict, or evaluate dementia or any medical disease. All activity patterns are supportive indicators to help families and community health workers provide warm, timely encouragement.

---

## 🚀 Key Functional Capabilities

### 1. Working Cognitive Game Hub (7 Complete Interactive Games)
1. **Memory Match (`/games/memory`):** Multi-pair card flip game with attempt counter, accuracy computation, mistake tracking, hints, sound synthesis, and real-time AI difficulty adaptation.
2. **NER Cultural Match (`/games/cultural`):** Culturally familiar imagery representing traditions, crafts, and landscapes across all 8 NER states + General NER with historical facts upon each match.
3. **Sequence Recall (`/games/attention`):** Attention and working-memory reproduction with timed preview countdown.
4. **Pattern Match (`/games/pattern`):** Reasoning puzzles based on traditional textile weaves (Gamosa/Puan) and nature sequences.
5. **Daily Routine Recall (`/games/daily-recall`):** Sequences daily habits like morning medications, hydration, and restful evening routines.
6. **Familiar Object Recognition (`/games/objects`):** Semantic memory cues identifying brass tea cups, bamboo cane baskets, handloom shawls, umbrellas, and local fruits.
7. **Sound & Environmental Recall (`/games/sound`):** Built-in Web Audio API synthesizer reproducing monsoon rain, singing bowls, temple bells, river streams, and morning songbirds.

### 2. Adaptive AI Personalization Engine (`src/ai/`)
- **Formula:**
  $$\text{Performance Score} = (\text{Accuracy} \times 0.45) + (\text{Speed} \times 0.20) + (\text{Consistency} \times 0.20) + (\text{Completion} \times 0.15)$$
- **Difficulty Tiers:** *Beginner, Easy, Moderate, Advanced*
- **Explainable AI:** Dynamic *"Why was this activity selected?"* modal explains difficulty stepping without medical jargon.
- **Trend Detection:** Non-stigmatizing labels (*"Stable activity"*, *"Improving activity trend"*, *"Activity trend changed"*).

### 3. Breathing & Well-being Center (`/breathing`, `/wellbeing`, `/grounding`)
- **Breathing Pacer:** Large animated circle executing 4-2-6 respiration (4s Inhale, 2s Hold, 6s Exhale) with spoken voice guidance and Himalayan singing bowl audio.
- **5-4-3-2-1 Sensory Grounding:** Multi-step sensory anchoring tool (5 see, 4 touch, 3 hear, 2 smell, 1 taste).
- **Well-being Monitor & Wearable Architecture:** Realtime telemetry simulation (Heart Rate, Respiratory Rate, HRV, Skin Conductance) with transparent *"Demo Sensor Data"* labeling and future Web Bluetooth integration roadmap.

### 4. Role-Aware Spoken Voice Assistant (`/assistant`)
- Dynamically adapts personality and intelligence based on authenticated role:
  - **Elderly:** Warm conversational companion answering medicine times, starting games, or initiating phone calls.
  - **Caregiver:** Summarizes daily adherence, active alerts, and activity shift reports.
  - **Healthcare Worker:** Cohort adherence overviews and activity plan tracking.
- Supports **English, Hindi, and Assamese**, with text input fallback.

### 5. Daily Living & Memory Assistance
- **Smart Reminders (`/reminders`):** Medication, hydration, meals, appointments, and family calls with toggleable completion and audio confirmation.
- **Structured Daily Timeline (`/routine`):** Circadian checklist from 7:00 AM wake-up to 9:00 PM sleep preparation.
- **Family Memory Lane (`/memory-lane`):** Biographical reminiscence photo companion with privacy encryption and "Who is this?" / "Where did we visit?" prompts.

### 6. Caregiver & Healthcare Portals
- **Caregiver Dashboard (`/caregiver`):** Senior status cards, SMT-4821 join-code linking, 7d/30d/90d Recharts trend analytics, and explainable activity change alerts.
- **Healthcare Worker Portal (`/healthcare`):** Cohort tracking, clinical notes, and assignable supportive activity plans (inspired by ACE workflow) that synchronize directly to the senior's tablet.

### 7. Offline-First PWA Synchronization (`/architecture`)
- Built for remote hill stations with intermittent connectivity.
- Local IndexedDB / localStorage queue records all offline sessions.
- Top-bar *"Simulated Offline Mode"* toggle allows judges to test offline resilience in real-time.
- One-click batch sync demonstrates queue uploading and conflict-free reconciliation.

### 8. Elderly-Friendly Ergonomics & Accessibility Bar
- Minimum 44px+ touch targets everywhere.
- Floating accessibility dock:
  - Font Size: Normal (16px), Large (19px), Extra Large (22px)
  - High Contrast mode
  - Reduced Motion mode
  - Spoken voice guidance toggle
  - Simple Language mode

### 9. 14-Step SIH 2026 Presentation Demo Tour
- A persistent *"SIH Demo Tour"* widget guides evaluators step-by-step through:
  1. Login as Elderly (Asha, 68)
  2. Start Memory Game
  3. Complete game & hear chimes
  4. View transparent performance score
  5. Inspect AI difficulty adaptation
  6. Start 4-2-6 breathing exercise
  7. Complete breathing session
  8. Manage smart reminders
  9. Inspect radar cognitive profile
  10. Switch to Caregiver Dashboard
  11. Show updated session data
  12. Review 7d/30d/90d trend reports
  13. Review explainable supportive alerts
  14. Assign healthcare activity plans

---

## 🛠️ Technology Stack (100% JavaScript — No TypeScript)

- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide React, Recharts, Canvas Confetti
- **Audio & Speech:** Web Audio API (100% offline procedural synthesis for bells, rain, and chimes), Web Speech API
- **Backend:** Node.js, Express.js
- **Data & Sync:** MongoDB / Atlas abstraction with client-side IndexedDB & localStorage offline sync queue
- **Network Port Configuration:**
  - Vite dev server: `0.0.0.0:3000` (User-facing live preview)
  - Express API: `0.0.0.0:5000` (REST API & static fallback)

---

## 👥 Team & Hackathon Details

- **Team Name:** Phantom techie
- **Smart India Hackathon 2026**
- **Problem Statement ID:** 26003
- **Ministry:** Ministry of Development of North Eastern Region (MDoNER)
- **Tagline:** Cognitive Care for Brighter Tomorrows
