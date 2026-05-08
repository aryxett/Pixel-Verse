# Contributing to PixelVerse

Thank you for your interest in contributing to PixelVerse! This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

---

## Getting Started

### Prerequisites

- Node.js 20+
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, Next.js, and TypeScript

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/gaming-assistant.git
cd gaming-assistant
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/gaming-assistant.git
```

4. **Install dependencies**:
```bash
npm install
```

5. **Set up environment**:
```bash
cp .env.local.example .env.local
# Add your API keys
```

6. **Run development server**:
```bash
npm run dev
```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Test build
npm run build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill in the PR template
4. Submit for review

---

## Coding Standards

### TypeScript

- **Use strict mode**: All files should use TypeScript strict mode
- **Define types**: Always define interfaces/types for data structures
- **Avoid `any`**: Use proper types instead of `any`
- **Use type guards**: For runtime type checking

**Example:**
```typescript
// ✅ Good
interface Game {
  id: string;
  title: string;
  rating: number;
}

function getGame(id: string): Game | null {
  // ...
}

// ❌ Bad
function getGame(id: any): any {
  // ...
}
```

### React Components

- **Use functional components**: No class components
- **Use hooks**: Prefer hooks over HOCs
- **Keep components small**: Max 300 lines
- **Extract reusable logic**: Use custom hooks

**Example:**
```typescript
// ✅ Good
export default function GameCard({ game }: { game: Game }) {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="game-card">
      {/* ... */}
    </div>
  );
}

// ❌ Bad
export default class GameCard extends React.Component {
  // ...
}
```

### Styling

- **Use Tailwind CSS**: Utility-first approach
- **Follow design system**: Use existing components
- **Responsive design**: Mobile-first approach
- **Dark theme**: All components should support dark mode

**Example:**
```tsx
// ✅ Good
<div className="rounded-xl border border-white/[0.07] bg-slate-900/80 p-4">
  {/* ... */}
</div>

// ❌ Bad
<div style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
  {/* ... */}
</div>
```

### File Organization

```
component/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests (if applicable)
└── index.ts               # Barrel export (if needed)
```

### Naming Conventions

- **Components**: PascalCase (`GameCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`interface Game {}`)

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(ai): add mood-based recommendations"

# Bug fix
git commit -m "fix(decision-engine): correct match score calculation"

# Documentation
git commit -m "docs: update API reference"

# Refactor
git commit -m "refactor(components): extract reusable GameCard variants"
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues/PRs in footer if applicable

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated checks**: CI/CD runs linting and tests
2. **Code review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged

### After Merge

- Delete your feature branch
- Pull latest changes from main
- Celebrate! 🎉

---

## Testing

### Manual Testing

1. **Run the app**:
```bash
npm run dev
```

2. **Test your changes**:
- Check UI in browser
- Test different screen sizes
- Verify functionality works

3. **Test edge cases**:
- Empty states
- Error states
- Loading states

### Automated Testing (Future)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying environment variables
- Updating dependencies

### Documentation Files

- `README.md` - Project overview
- `DOCUMENTATION.md` - Complete documentation
- `TECHNICAL_GUIDE.md` - Technical details
- `API_REFERENCE.md` - API documentation
- `CONTRIBUTING.md` - This file

### Code Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use exponential backoff to prevent API rate limiting
const delay = Math.pow(2, retryCount) * 1000;

// ❌ Bad - Obvious comment
// Set delay to 2 to the power of retryCount times 1000
const delay = Math.pow(2, retryCount) * 1000;
```

---

## Feature Requests

### Before Submitting

1. Check if feature already exists
2. Search existing issues
3. Consider if it fits project scope

### Creating Feature Request

1. Go to GitHub Issues
2. Use "Feature Request" template
3. Provide:
   - Clear description
   - Use cases
   - Mockups (if applicable)
   - Implementation ideas

---

## Bug Reports

### Before Submitting

1. Check if bug already reported
2. Try to reproduce consistently
3. Gather relevant information

### Creating Bug Report

1. Go to GitHub Issues
2. Use "Bug Report" template
3. Provide:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Environment details

---

## Questions and Support

### Where to Ask

- **GitHub Discussions** - General questions
- **GitHub Issues** - Bug reports, feature requests
- **Discord** (if available) - Real-time chat

### Before Asking

1. Check documentation
2. Search existing issues/discussions
3. Try to solve it yourself

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Contact

- **Project Maintainer**: [Your Name]
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Thank you for contributing to PixelVerse! 🎮**
