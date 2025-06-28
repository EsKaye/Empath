# EmPath - AI-Powered Empathy Companion 🌟

EmPath is a modern, client-side application that provides empathetic responses to user inputs using AI-powered sentiment analysis. Built with React, TypeScript, and cutting-edge web technologies, it offers a seamless, accessible, and secure experience for personal and business guidance.

## ✨ Features

- 🤖 **AI-Powered Conversations**: Intelligent responses using Mistral AI with sentiment analysis
- 🎨 **Modern UI/UX**: Beautiful, responsive design with Radix UI and Tailwind CSS
- ♿ **Accessibility First**: Full ARIA support, keyboard navigation, and screen reader compatibility
- 🔒 **Privacy-Focused**: Client-side processing with optional cloud sync
- 💾 **Smart Storage**: Local data persistence with IndexedDB
- 📱 **Mobile-First**: Responsive design that works perfectly on all devices
- ⚡ **Performance Optimized**: Fast loading and smooth animations
- 🎯 **Business Intelligence**: Sentiment analysis and category classification

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Radix UI + Tailwind CSS
- **AI Integration**: Mistral AI API
- **State Management**: React Hooks + Custom Hooks
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typewriter Effect**: Typewriter-effect
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript ESLint

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Mistral AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/empath.git
   cd empath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Mistral AI API key to `.env`:
   ```env
   VITE_MISTRAL_API_KEY=your_mistral_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AnimatedMessage.tsx
│   ├── BusinessAdvisor.tsx
│   └── ConversationHeader.tsx
├── hooks/              # Custom React hooks
│   ├── useConversations.ts
│   ├── useInputFocus.ts
│   └── useScrollToBottom.ts
├── lib/                # External library configurations
│   ├── mistral.ts
│   └── sentiment.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── mistral.ts
│   └── sentiment.ts
├── config/             # Configuration files
│   └── env.ts
└── constants/          # Application constants
    └── index.ts
```

## 🎯 Core Features

### AI-Powered Conversations
- Intelligent response generation using Mistral AI
- Sentiment analysis and classification
- Context-aware conversation flow
- Natural language processing

### Sentiment Analysis
- Real-time sentiment detection
- Category classification (Purpose, Alignment, Service, etc.)
- Emotional intelligence insights
- Progress tracking

### User Experience
- Smooth animations and transitions
- Real-time typing effects
- Auto-scroll to latest messages
- Responsive design for all devices

### Data Management
- Local storage with IndexedDB
- Export/import conversation data
- Auto-save functionality
- Conversation history management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_MISTRAL_API_KEY=your_mistral_api_key_here
VITE_APP_TITLE=EmPath
VITE_APP_DESCRIPTION=AI-Powered Empathy Companion
```

### API Configuration

The application uses Mistral AI for conversation processing. Configure your API key in the environment variables.

## 🎨 Customization

### Themes
The application uses Radix UI themes with customizable colors and styling. Modify the theme configuration in `src/App.tsx`.

### Styling
Customize the appearance using Tailwind CSS classes and CSS custom properties.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) for providing the AI capabilities
- [Radix UI](https://www.radix-ui.com/) for the excellent component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/empath/issues) page
2. Create a new issue with detailed information
3. Contact us at support@empath.com

---

**Made with ❤️ for better human-AI interactions**
