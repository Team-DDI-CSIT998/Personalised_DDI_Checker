<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MedMatch: Personalized DDI Checker</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 2rem;
      background: #f8f9fa;
      color: #2b2d42;
    }
    h1, h2, h3 {
      color: #2a9d8f;
    }
    section {
      margin-bottom: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      padding: 2rem;
    }
    .badge {
      background: #2a9d8f;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: bold;
      display: inline-block;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    ul li::before {
      content: '✨';
      margin-right: 0.5rem;
    }
    code {
      background: #e0f7f1;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
    }
    pre {
      background: #f1f1f1;
      padding: 1rem;
      overflow-x: auto;
      border-radius: 6px;
    }
    .footer {
      text-align: center;
      margin-top: 4rem;
      font-size: 0.9rem;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <h1>💊🧠 Personalized Drug-Drug Interaction (DDI) Checker</h1>
  <span class="badge">MEDMATCH – DDI Checker</span>
  <p><strong>Built with ❤️ by Team DDI – CSIT998 Capstone Project @ University of Wollongong (2025)</strong></p>

  <section>
    <h2>🚀 About the Project</h2>
    <p>
      👨‍⚕️ <strong>MedMatch</strong> is a smart Clinical Decision Support System (CDSS) that helps identify potentially dangerous drug-drug interactions 💥 using:
    </p>
    <ul>
      <li>🧠 Deep learning models</li>
      <li>💬 AI Chatbot support</li>
      <li>📝 Patient history integration</li>
      <li>💾 MongoDB storage</li>
      <li>🔐 Secure, role-based access</li>
    </ul>
  </section>

  <section>
    <h2>🖥️ Features</h2>
    <ul>
      <li>🧬 AI-Powered Interaction Detection</li>
      <li>🤖 Chatbot Assistant</li>
      <li>👨‍⚕️ Doctor Portal</li>
      <li>🧑‍⚕️ Patient Portal</li>
      <li>📋 Medical History Summarization</li>
      <li>⚠️ Interaction Alerts</li>
      <li>🌗 Dark Mode</li>
    </ul>
  </section>

  <section>
    <h2>🧪 Tech Stack</h2>
    <ul>
      <li><strong>Frontend</strong>: React + TypeScript</li>
      <li><strong>Backend</strong>: Express.js & FastAPI</li>
      <li><strong>AI/ML</strong>: ChemBERTa, DeepSeek, DL-DDI</li>
      <li><strong>Database</strong>: MongoDB</li>
    </ul>
  </section>

  <section>
    <h2>🛠️ Setup & Run Locally</h2>
    <pre><code># Clone the repo
git clone https://github.com/Team-DDI-CSIT998/Personalised_DDI_Checker.git
cd Personalised_DDI_Checker

# Install dependencies
npm install  # frontend
pip install -r requirements.txt  # backend

# Start servers
npm run dev
uvicorn src.python.main:app --reload</code></pre>
    <p>🔑 Set up your <code>.env</code> file with necessary variables like <code>MONGO_URI</code> and <code>OPENROUTER_API_KEY</code></p>
  </section>

  <section>
    <h2>🐞 Bugs? Glitches? Quirks?</h2>
    <p>
      If you stumble across a bug, glitch, or AI going Shakespearean... 😅<br />
      Well, let’s just say we were powered by caffeine and panic.
    </p>
    <blockquote>
      <em>"Why is this button floating?"</em><br />
      <em>"Why is the chatbot writing a poem about Aspirin?"</em><br />
      <strong>→ Probably a feature. Maybe.</strong>
    </blockquote>
    <p>
      Built under academic deadline pressure 🕒 – your understanding is gold.<br />
      Report bugs <a href="https://github.com/Team-DDI-CSIT998/Personalised_DDI_Checker/issues">here</a> 🧰
    </p>
  </section>

  <section>
    <h2>📬 Contact</h2>
    <p>Email: <a href="mailto:medmatch.project2025@gmail.com">medmatch.project2025@gmail.com</a></p>
    <p>GitHub: <a href="https://github.com/Team-DDI-CSIT998">Team-DDI-CSIT998</a></p>
  </section>

  <div class="footer">
    ⭐ If you enjoyed this project, star it on GitHub — your support means everything 💖
  </div>
</body>
</html>
