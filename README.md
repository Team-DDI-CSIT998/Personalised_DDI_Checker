# 💊🧠 Personalized Drug-Drug Interaction (DDI) Checker  
### 🧬 Smart Medical Assistant for Safer Prescriptions

![Project Banner](https://img.shields.io/badge/MEDMATCH-DDI%20Checker-2A9D8F?style=for-the-badge&logo=medchart&logoColor=white)

> Built with ❤️ by Team DDI – CSIT998 Capstone Project @ University of Wollongong (2025)

---

## 🚀 About the Project

👨‍⚕️ **MedMatch: Personalized DDI Checker** is an intelligent Clinical Decision Support System (CDSS) that helps doctors and patients identify **potentially dangerous drug-drug interactions** 💥 by combining:

- 🧠 Deep learning for DDI classification
- 💬 A natural chatbot assistant
- 📝 Real-time analysis of patient history and prescribed medications
- 💾 MongoDB for structured medical data
- 🔐 Secure, role-based doctor/patient portals

---

## 🖥️ Features

✨ Here’s what makes our system special:

- 🧬 **AI-Powered Interaction Detection** – Get instant alerts on harmful combinations  
- 🤖 **Interactive Chatbot Assistant** – Ask anything about your prescriptions, conditions, or risks  
- 👨‍⚕️ **Doctor Portal** – Add/manage patients, view consultation history, and prescribe safely  
- 🧑‍⚕️ **Patient Portal** – Understand risks in plain English, track medications  
- 📋 **Auto Summarization** – Upload your history; we’ll clean, summarize, and analyze it  
- ⚠️ **Alerts Panel** – Know what to avoid, and why  
- 🌗 **Light/Dark Mode** – Because your eyes deserve it

---

## 🧪 Tech Stack

| Frontend ⚛️ | Backend ⚙️ | AI/ML 🧠 | Database 💾 |
|-------------|-------------|----------|-------------|
| React + TypeScript | Express.js & FastAPI | ChemBERTa, DeepSeek, DL DDI models | MongoDB |

---

## 📸 UI Snapshots

> *(Include screenshots or gifs if possible)*  
> `![Doctor Portal](./assets/doctor_portal.png)`  
> `![DDI Alerts](./assets/ddi_alerts.gif)`

---

## 🔍 System Architecture

Doctor → Portal → Prescription Input
↓
DDI Checker ← Drug & History DB ← Patient Notes
↓
🔔 Risk Alerts + Chatbot Explanation



*(See full architecture diagram in `/docs/architecture.pdf`)*

---

## 🧠 AI Models Used

- 🤖 **ChemBERTa** – Classifies drug interaction severity
- 🔬 **DeepDDI** – SMILES-based interaction prediction
- 💬 **Custom LLMs** – GPT-based chatbot for plain-language explanations
- 🧹 **Deidentifier** – Removes sensitive data from patient records

---

## 🔐 Authentication & Roles

- 👨‍⚕️ Doctor Role  
- 🧑‍⚕️ Patient Role  
- 🔒 JWT-secured endpoints  
- 💌 Password-protected access  

---

## 🛠️ Setup & Run Locally

```bash
# Clone the repo
git clone https://github.com/Team-DDI-CSIT998/Personalised_DDI_Checker.git
cd Personalised_DDI_Checker

# Install backend and frontend
npm install  # for frontend
pip install -r requirements.txt  # for backend Python API

# Start both servers
npm run dev  # frontend
uvicorn src.python.main:app --reload  # backend

🔑 Be sure to configure your .env file with MONGO_URI, OPENROUTER_API_KEY, etc.

📚 References
🧬 DrugBank Database

🧠 DeepDDI Paper (PNAS)

🔒 HIPAA Guidelines

💡 MedMatch Capstone 2025 Docs

## 🐞 Bugs? Glitches? Quirks?

If you happen to stumble upon a bug, odd behavior, or the occasional AI hiccup... 😅  
Well, let’s just say: **we coded this with caffeine and deadlines.**

> _"Why is this button floating?"_  
> _"Why did the chatbot suddenly start quoting Shakespeare?"_  
> _→ That's probably a feature... maybe._

💬 **Seriously though**, we're aware this project isn't flawless.  
It was built under tight academic deadlines and limited bandwidth – so we appreciate your understanding.  
Feel free to report issues or weirdness [here](https://github.com/Team-DDI-CSIT998/Personalised_DDI_Checker/issues) and we’ll do our best to patch it up! 🧰


📬 Contact
Have questions or want to collaborate?

📧 Email us: medmatch.project2025@gmail.com
🌐 Project Page: Team-DDI-CSIT998 GitHub

⭐ Show Your Support
If you liked this project, give it a ⭐ on GitHub!
Your support means a lot to us 💖
