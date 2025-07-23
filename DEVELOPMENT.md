# Development Guide

This guide provides detailed information about the development setup and workflows for the React Gauge Component project.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm run test

# Build the library
pnpm run build:lib
```

## 📦 Prerequisites

- Node.js 20+ (use `.nvmrc` for exact version)
- pnpm 8+ (package manager)
- Git

## 🛠️ Development Setup

### 1. Environment Setup

The project uses:

- **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling (inline classes, no config needed)
- **Vitest** for unit testing
- **Biome** for linting and formatting (TypeScript/JavaScript/JSON)
- **markdownlint** for Markdown files

### 2. Available Scripts

```bash
# Development
pnpm run dev          # Start dev server with examples
pnpm run preview      # Preview production build

# Building
pnpm run build        # Build examples
pnpm run build:lib    # Build library for distribution

# Code Quality
pnpm run lint         # Run Biome linting and markdownlint
pnpm run lint:fix     # Fix linting issues
pnpm run format       # Format code with Biome
pnpm run format:check # Check code formatting
pnpm run type-check   # TypeScript type checking
pnpm run check-all    # Run all checks

# Testing
pnpm run test         # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run test:ui      # Open Vitest UI
pnpm run test:coverage # Generate test coverage
```

## 🔧 Development Workflow

### Pre-commit Hooks

The project uses Husky and lint-staged to ensure code quality:

- Automatically runs Biome linting/formatting on staged TypeScript/JavaScript/JSON files
- Automatically runs markdownlint on staged Markdown files
- Prevents commits with linting errors
- Ensures consistent code formatting

### VS Code Integration

Recommended extensions are configured in `.vscode/extensions.json`:

- Biome (linting and formatting)
- Tailwind CSS IntelliSense
- TypeScript utilities
- Vitest extension

Settings are pre-configured for:

- Format on save with Biome
- Auto-fix with Biome
- TypeScript SDK from node_modules

### Testing

Tests are written using Vitest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gauge } from './Gauge';

describe('Gauge', () => {
  it('renders correctly', () => {
    render(<Gauge value={50} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

## 🚀 CI/CD

### GitHub Actions Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push/PR to `master` and `develop` branches
   - Linting and type checking
   - Building library and examples
   - Running tests
   - Security scanning

2. **Publish Pipeline** (`.github/workflows/publish.yml`)
   - Triggered on GitHub releases
   - Publishes to npm registry
   - Requires NPM_TOKEN secret

3. **Dependency Review** (`.github/workflows/dependency-review.yml`)
   - Reviews dependency changes in PRs
   - Checks for security vulnerabilities
   - License compliance

### Dependabot

Configured to:

- Check for dependency updates weekly
- Group updates by type (dev/prod)
- Auto-create PRs with proper labels

## 📝 Code Style

### TypeScript

- Strict mode enabled
- No unused variables/parameters
- Explicit return types preferred
- Interfaces over types for objects

### React

- Functional components with hooks
- Props interfaces clearly defined
- Memoization where appropriate
- Proper error boundaries

### CSS/Styling

- Tailwind CSS v4 utility classes
- No separate CSS files needed
- Responsive design patterns
- Semantic color usage

## 🏗️ Architecture

```
src/
├── Gauge.tsx        # Main component
├── Gauge.test.tsx   # Component tests
├── index.ts         # Public exports
└── test/
    └── setup.ts     # Test environment setup
```

### Component Design Principles

1. **Self-contained**: No external CSS imports required
2. **Customizable**: Extensive props for customization
3. **Accessible**: Proper ARIA attributes
4. **Performant**: SVG-based rendering
5. **Type-safe**: Full TypeScript support

## 🚢 Publishing

### Pre-publish Checklist

1. Update version in `package.json`
2. Run `pnpm run check-all`
3. Update CHANGELOG
4. Create git tag
5. Push changes and tag

### Manual Publishing

```bash
# Build the library
pnpm run build:lib

# Publish to npm
pnpm publish --access public
```

### Automated Publishing

Create a new GitHub release to trigger automated npm publishing.

## 🐛 Debugging

### Development Server

- Uses Vite's HMR for instant updates
- Source maps enabled
- React DevTools compatible

### Common Issues

1. **Build fails**: Check TypeScript errors with `pnpm run type-check`
2. **Tests fail**: Run `pnpm run test:ui` for interactive debugging
3. **Linting errors**: Use `pnpm run lint:fix` to auto-fix

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all checks pass
5. Submit a pull request

### Commit Convention

Follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/tool updates

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Testing Library](https://testing-library.com/react)

---

For more information, see the main [README.md](./README.md) or check the [project documentation](./docs/).
