## Frontend README.md

```markdown
# NewsBot Frontend

A React-based frontend for interacting with the NewsBot RAG-powered news chatbot.

## 🚀 Features

- Clean, responsive chat interface
- Real-time message streaming
- Session management
- Message history persistence
- Responsive design with SCSS styling
- Error handling and user feedback

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: SCSS with custom design system
- **HTTP Client**: Axios
- **State Management**: React hooks
- **Build Tool**: Create React App
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd newsbot-frontend
Install dependencies:

bash
npm install
Set up environment variables:

bash
cp .env.example .env
Edit .env with your backend URL:

env
REACT_APP_API_URL=https://newsbot-backend-bnnc.onrender.com
REACT_APP_ENVIRONMENT=production
Run the development server:

bash
npm start
🎨 UI Components
ChatInterface - Main chat container

MessageList - Display chat messages

MessageInput - Message input with send button

Responsive design for mobile and desktop

🔧 Development
Use npm start for development

Use npm run build for production build

Use npm test for testing

🌐 Deployment
The application is deployed on Netlify with continuous deployment from the main branch.

📋 Environment Variables
Variable	Description	Required
REACT_APP_API_URL	Backend API URL	Yes
REACT_APP_ENVIRONMENT	Environment mode	Yes
🐛 Troubleshooting
Common issues:

Check that the backend URL is correct and accessible

Verify CORS is configured correctly on the backend

Check browser console for error messages
