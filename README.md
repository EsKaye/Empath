# EmPath - AI-Powered Empathy Companion

EmPath is a lightweight, client-side application that provides empathetic responses to user inputs using AI-powered sentiment analysis. The app runs entirely in the browser, utilizing modern web technologies for a fast and responsive experience.

## Features

- 🔒 Secure authentication with Google Sign-In
- 💭 AI-powered sentiment analysis using Transformers.js
- 💾 Offline-first data storage with IndexedDB
- 🔄 Cloud sync with Firebase (optional)
- 🎨 Modern UI with Radix UI and Tailwind CSS

## Tech Stack

- React + Vite
- TypeScript
- Firebase Auth
- Transformers.js
- IndexedDB
- Radix UI
- Tailwind CSS
- Zustand

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/empath.git
   cd empath
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project and enable Authentication:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Authentication
   - Create a web app and copy the configuration

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration values in the `.env` file.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your preferred hosting service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
