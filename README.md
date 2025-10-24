# Meowbase Monorepo

This repository contains two projects:

## 📦 Projects

### `/meowbase` - Meowbase Library

A localStorage wrapper that mimics a database for learning purposes. This is the core library with a MongoDB-like document model, LRU caching, and comprehensive test coverage.

**Key Features:**

- Document-based collections stored in localStorage
- LRU cache with automatic eviction
- Full CRUD operations for collections and documents (cats)
- Sample dataset for learning and demos
- 48+ unit tests with Vitest + happy-dom

**Development:**

```bash
cd meowbase
npm install
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

See [meowbase/README.md](./meowbase/README.md) for complete documentation.

### `/docs` - Documentation Website

A Vite-powered documentation website for Meowbase, built with Quiet UI components.

**Development:**

```bash
cd docs
npm install
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🚀 Getting Started

### Initial Setup

From the root directory, install all dependencies for both projects:

```bash
npm install
```

This will install dependencies for both the `meowbase` library and the `docs` website using npm workspaces.

### Running Tests

Run tests from the root:

```bash
npm test              # Run meowbase tests
npm run test:watch    # Run meowbase tests in watch mode
```

### Running the Docs Site

Start the documentation website from the root:

```bash
npm run dev:docs      # Start docs dev server
npm run build:docs    # Build docs for production
```

## 📁 Repository Structure

```
meowbase/                    # Root
├── meowbase/                # Library package
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── README.md
│   ├── meowbase.ts
│   ├── types.ts
│   ├── cats/
│   ├── collections/
│   ├── core/
│   └── __tests__/
└── docs/                    # Documentation website
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    ├── public/
    └── source/
        ├── main.ts
        ├── style.css
        └── content/
```

## 🔧 Workspace Commands

The root `package.json` provides convenient scripts for working with both projects:

- `npm test` - Run Meowbase tests
- `npm run test:watch` - Run Meowbase tests in watch mode
- `npm run test:ui` - Open Vitest UI for Meowbase
- `npm run test:coverage` - Generate test coverage report
- `npm run dev:docs` - Start docs development server
- `npm run build:docs` - Build docs for production

## 📖 Documentation

- **Meowbase Library:** See [meowbase/README.md](./meowbase/README.md)
- **API Reference:** See [meowbase/README.md#api-reference](./meowbase/README.md#api-reference)
- **Architecture:** See [meowbase/README.md#architecture](./meowbase/README.md#architecture)

## 🧪 Testing

All tests are located in the `/meowbase/__tests__/` directory. The test suite uses:

- **Vitest** for the test runner
- **happy-dom** for simulating browser APIs (localStorage) in Node.js

Current test coverage:

- ✅ Storage adapter tests (19 tests)
- ✅ Cache tests (20 tests)
- ✅ Sample data tests (9 tests)
- 🚧 Collection operations tests (pending)
- 🚧 Cat operations tests (pending)

## 📝 License

MIT
