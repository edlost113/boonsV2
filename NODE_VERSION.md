# Node.js Version Management

This project uses Node.js version 22 and requires Angular CLI to be installed globally.

## Quick Setup
```bash
nvm use                              # Switch to Node.js 22
npm install -g @angular/cli@latest   # Install Angular CLI (if not installed)
npm install                          # Install project dependencies
```

## Automatic Version Switching

### Option 1: Manual (Always works)
```bash
nvm use
```

### Option 2: Check for Angular CLI
If you get "ng: command not found", install Angular CLI:
```bash
npm install -g @angular/cli@latest
```

### Option 3: Automatic with shell integration

Add this to your `~/.zshrc` file for automatic switching:

```bash
# Automatically switch node versions when entering a directory with .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
      # Check if ng command is available, if not remind to install
      if ! command -v ng &> /dev/null; then
        echo "💡 Tip: Run 'npm install -g @angular/cli@latest' to install Angular CLI"
      fi
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## Troubleshooting

### "ng: command not found"
This happens when Angular CLI is not installed for the current Node.js version:
```bash
npm install -g @angular/cli@latest
```

### Different Node versions have different global packages
Each Node.js version installed via nvm has its own global npm packages. When you switch to Node.js 22, you need to install Angular CLI specifically for that version.

### VS Code Terminal Issues
If VS Code terminals don't recognize `ng`, restart VS Code after installing Angular CLI globally.

## Development Commands
```bash
npm start              # Start development server
ng serve --open        # Start dev server and open browser
ng build              # Build for production
ng generate component  # Generate new component
```