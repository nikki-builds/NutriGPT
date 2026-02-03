# 🥗 NutriGPT

## 🌐 Live Demo

**[View Live Demo](https://nutri-gpt.vercel.app/)**  
_(Portfolio demo – some features are intentionally limited)_

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4+-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4o-412991?logo=openai&logoColor=white)

---

## 🥗 About

**NutriGPT** is a playful, AI-powered nutrition chatbot that offers supportive, judgment-free feedback based on what you eat.

Rather than acting as a calorie tracker or medical tool, NutriGPT focuses on **reflection, balance, and sustainable eating habits**, making nutrition guidance feel more approachable and human.

---

## 🧠 Architecture

**NutriGPT uses a React frontend to collect user meal input and a Node.js backend to securely process OpenAI API requests and return AI-generated nutrition feedback.**

---

## 📖 Overview

NutriGPT allows users to describe their meals in natural language and receive thoughtful, encouraging nutrition feedback powered by OpenAI’s chat models.

Instead of emphasizing strict food rules or calorie counting, the project explores how **conversational AI** can support a healthier and more sustainable relationship with food.

---

## ✨ Features

- 🧠 **AI-Powered Nutrition Feedback**  
  Uses OpenAI **gpt-4o** to generate supportive, nutrition-aware responses

- 💬 **Chat-Based Experience**  
  Simple and familiar messaging-style interface

- 🥗 **Context-Aware Responses**  
  Understands meals and eating habits rather than individual ingredients only

- 🧩 **Structured AI Responses**  
  Returns clearly separated sections using line breaks and headings (text-based)

- 🔐 **Secure API Handling**  
  OpenAI API calls are handled entirely on the backend to protect API keys

- 📱 **Responsive UI**  
  Clean, mobile-friendly layout built with Tailwind CSS

- 🔄 **Automatic Scroll**  
  Chat automatically scrolls to the latest message

- ⌨️ **Input Autofocus**  
  Input field refocuses after each AI response for smooth interaction

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express

### AI
- OpenAI Chat Completions API (**gpt-4o**)

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nikki-builds/NutriGPT.git
cd nutrigpt
```

2. **Install dependencies**

Root (frontend):
```bash
npm install
```

Backend:
```bash
cd server
npm install
```

3. **Environment Variables**

Create a `.env` file in the `server` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
PORT=8000
```

4. **Start the application**

Backend:
```bash
cd server
npm run dev
```
Frontend (in a new terminal):
```bash
npm run dev
```

**Development URLs**

Frontend: http://localhost:5173
Backend: http://localhost:8000
The app will open at http://localhost:5173.

## 💡 Usage

1. Describe what you ate (e.g. “I had avocado toast and eggs for breakfast”)
2. Receive AI-generated nutrition feedback
3. Continue chatting to reflect on habits and patterns
4. Ask follow-up questions for more suggestions

## 🚧 Design Choices & Limitations

- No database is used in the current version
- Chat history resets on refresh
- No user accounts or persistent memory
- Responses are rendered as formatted text (not markdown-rendered HTML) 

These decisions were intentional, allowing the project to focus on:
- conversational AI quality
- prompt design
- user experience simplicity

## 📸 Screenshots

## 🚀 Future Enchancements

- [ ] Backend deployment with persistent storage
- [ ] Secure API handling in production
- [ ] Chat history with MongoDB
- [ ] User profiles & preferences
- [ ] Nutrition pattern awareness over time
- [ ] Meal tagging (breakfast, lunch, snack)
- [ ] Onboarding questionnaire
- [ ] Multi-language support

## 📝 License
MIT License

## 👤 Author

**Na Yeon (Nikki) Kim**
- Transitioning from nutrition background to tech
- Combining nutrition expertise with full-stack, AI-powered application development
- Interested in human-centered health tools

## 🙏 Acknowledgments

- OpenAI for the Chat Completions API
- Tailwind CSS for styling framework

