# Node.js Version Management

This project uses Node.js version 22. 

## Automatic Version Switching

### Option 1: Manual (Always works)
```bash
nvm use
```

### Option 2: Automatic with shell integration

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
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### Option 3: VS Code Integration

Create `.vscode/settings.json` with:
```json
{
  "terminal.integrated.shellArgs.osx": ["-c", "nvm use 22 2>/dev/null; exec zsh"]
}
```

## Quick Setup
Run this command in the project root:
```bash
nvm use
```