# AngularBoons 🦈

A powerful Angular application for browsing and managing D&D boons with dark mode support and advanced filtering.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Prerequisites

- **Node.js 22.x** (required)
- **nvm** (recommended for version management)

## Quick Setup

### Option 1: Automatic Setup
```bash
./setup.sh
```

### Option 2: Manual Setup
```bash
# Use the correct Node.js version
nvm use

# Install dependencies
npm install
```

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Node.js Version Management

This project uses Node.js 22. The `.nvmrc` file ensures consistent Node.js versions across all environments.

- **Automatic switching**: Run `nvm use` in the project directory
- **Manual switching**: Run `nvm use 22`
- **Check version**: Run `node --version` (should show v22.x.x)

For automatic version switching when entering the directory, see [NODE_VERSION.md](./NODE_VERSION.md) for shell configuration options.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
