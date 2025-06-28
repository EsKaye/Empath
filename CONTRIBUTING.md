# Contributing to EmPath 🌟

Thank you for your interest in contributing to EmPath! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your browser and operating system information
- Include any error messages or console logs

### Suggesting Features
- Check existing issues to avoid duplicates
- Provide a clear description of the feature
- Explain the use case and benefits
- Include mockups or examples if applicable

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your API keys
4. Start the development server: `npm run dev`
5. Open `http://localhost:5173` in your browser

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 📝 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all functions and components
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use type guards for runtime type checking

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries
- Use React.memo for performance optimization

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Ensure accessibility with proper ARIA labels
- Use CSS custom properties for theming
- Maintain consistent spacing and typography

### Accessibility
- Include proper ARIA labels and descriptions
- Ensure keyboard navigation works
- Provide alt text for images
- Use semantic HTML elements
- Test with screen readers

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size
- Use lazy loading for routes
- Minimize re-renders

## 🧪 Testing

### Writing Tests
- Write tests for all new functionality
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies
- Ensure good test coverage

### Running Tests
```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions and components
- Include examples in documentation
- Document complex business logic
- Keep documentation up to date

### API Documentation
- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Keep API documentation current

## 🔄 Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Run linting and fix any issues
3. Format code with Prettier
4. Update documentation if needed
5. Test your changes thoroughly

### Pull Request Guidelines
- Use descriptive titles
- Include a detailed description
- Reference related issues
- Include screenshots for UI changes
- Request reviews from maintainers

### Review Process
- All PRs require at least one review
- Address review comments promptly
- Maintainers may request changes
- PRs are merged after approval

## 🐛 Bug Reports

### Required Information
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Console errors or logs
- Screenshots if applicable

### Bug Report Template
```markdown
## Bug Description
[Clear description of the issue]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [Browser name and version]
- OS: [Operating system]
- EmPath Version: [Version number]

## Additional Information
[Any other relevant information]
```

## 💡 Feature Requests

### Guidelines
- Check existing issues first
- Provide clear use cases
- Include mockups or examples
- Explain the benefits
- Consider implementation complexity

### Feature Request Template
```markdown
## Feature Description
[Clear description of the feature]

## Use Case
[How this feature would be used]

## Benefits
[Why this feature is valuable]

## Implementation Ideas
[Optional: ideas for implementation]

## Additional Information
[Any other relevant information]
```

## 📄 License

By contributing to EmPath, you agree that your contributions will be licensed under the MIT License.

## 🙏 Acknowledgments

Thank you to all contributors who help make EmPath better!

---

**Happy coding! 🚀** 