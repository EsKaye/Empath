# TheEmPath iOS

A gentle, emotionally intelligent mentor app focused on clarity, purpose, and self-guidance.

## Project Structure

```
TheEmPath/
├── core/           # Core functionality and utilities
├── models/         # Data models and types
├── views/          # SwiftUI views
├── viewmodels/     # MVVM view models
├── themes/         # UI themes and styling
├── prompts/        # Reflection prompts
├── responses/      # Response generation
├── auth/           # Authentication
└── storage/        # Local storage
```

## Features

- **Welcome Flow**: Gentle introduction with emotional topic selection
- **Reflection**: Open-ended journaling with AI-powered insights
- **Profile**: Track emotional themes and breakthroughs
- **Themes**: Soothing light/dark aesthetic with natural tones

## Requirements

- iOS 15.0+
- Xcode 13.0+
- Swift 5.5+

## Installation

1. Clone the repository
2. Open `TheEmPath.xcodeproj` in Xcode
3. Build and run

## Architecture

The app follows MVVM architecture with:
- SwiftUI for views
- Combine for reactive programming
- Core Data for local storage
- AVSpeechSynthesizer for voice support

## License

MIT License 