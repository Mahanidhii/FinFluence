# 🤝 Contributing to FinFluence

Thank you for your interest in contributing to FinFluence! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Development Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/FinFluence.git
   cd FinFluence
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   
   # ML Service
   cd ../ml-service && pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp ml-service/.env.example ml-service/.env
   
   # Update with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: ML Service
   cd ml-service && python app.py
   
   # Terminal 3: Frontend
   cd frontend && npm start
   ```

## 📝 Contributing Guidelines

### Types of Contributions
- 🐛 **Bug Fixes**: Fix existing issues
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve docs, comments, README
- 🎨 **UI/UX**: Enhance user interface and experience
- ⚡ **Performance**: Optimize code performance
- 🧪 **Testing**: Add or improve tests
- 🔧 **DevOps**: Improve build process, CI/CD

### Before Contributing
1. Check existing [issues](https://github.com/Mahanidhii/FinFluence/issues)
2. Create an issue for new features or major changes
3. Discuss your approach in the issue comments
4. Wait for maintainer approval before starting work

## 🎨 Code Style

### JavaScript/React
- Use **ES6+ features** and modern JavaScript
- Follow **React Hooks** patterns
- Use **functional components**
- Add **JSDoc comments** for complex functions
- Use **meaningful variable names**

### Python
- Follow **PEP 8** style guide
- Use **type hints** where appropriate
- Add **docstrings** for functions and classes
- Use **meaningful variable names**

### General Guidelines
- Write **clean, readable code**
- Add **comments** for complex logic
- Use **consistent indentation** (2 spaces for JS, 4 for Python)
- Remove **console.logs** and **debug prints** before committing

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes
- Write clean, documented code
- Add tests if applicable
- Update documentation if needed

### 3. Test Your Changes
```bash
# Run tests
npm test                    # Frontend
npm run test               # Backend
python -m pytest          # ML Service (if tests exist)

# Manual testing
# Ensure all three services start without errors
# Test the specific functionality you modified
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add expense categorization feature"

# Use conventional commit messages:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting changes
# refactor: code refactoring
# test: adding tests
# chore: maintenance tasks
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request with:
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Testing instructions** for reviewers

## 🐛 Issue Reporting

### Bug Reports
Include:
- **Clear description** of the bug
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots** if applicable
- **Console errors** if any

### Feature Requests
Include:
- **Clear description** of the feature
- **Use case** and **benefit**
- **Possible implementation** approach
- **Mockups** or **examples** if helpful

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [scikit-learn Documentation](https://scikit-learn.org/stable/)

### Learning Resources
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Python Best Practices](https://docs.python-guide.org/)

## 🚫 What NOT to Contribute

- **Breaking changes** without discussion
- **Large refactoring** without prior approval
- **Sensitive data** or **API keys**
- **Unrelated dependencies** without justification
- **Competitive features** (leaderboards, rankings)

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project README.md
- Release notes for significant contributions

## 💬 Questions?

- Open an [issue](https://github.com/Mahanidhii/FinFluence/issues) for questions
- Join our community discussions
- Contact maintainers directly

---

**Thank you for making FinFluence better! 🚀**