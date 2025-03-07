# Windsurf Trim Whitespace

A simple Windsurf extension that automatically removes trailing whitespace from your files when saving. Keep your code clean without thinking about it!

## Features

- **Automatic Whitespace Trimming**: Automatically removes trailing whitespace from all lines when you save a file
- **Language-specific Exclusions**: Configure specific language types to exclude from whitespace trimming
- **Manual Trigger**: Use the command palette to manually trigger whitespace trimming when needed
- **Lightweight**: Minimal performance impact on your editing experience

## Requirements

- Windsurf v1.0.0 or higher

## Extension Settings

This extension contributes the following settings:

* `windsurfTrimWhitespace.enabled`: Enable/disable automatic trimming of trailing whitespace on save (default: `true`)
* `windsurfTrimWhitespace.excludedLanguages`: List of language IDs for which whitespace trimming should be disabled (default: `[]`)

Example configuration in settings.json:

```json
{
  "windsurfTrimWhitespace.enabled": true,
  "windsurfTrimWhitespace.excludedLanguages": ["markdown", "plaintext"]
}
```

## Known Issues

No known issues at this time. If you encounter any problems, please report them on the [GitHub repository](https://github.com/justinleveck/windsurf-trim-whitespace/issues).

## Release Notes

### 0.0.1

Initial release of Windsurf Trim Whitespace:
- Automatic trailing whitespace removal on save
- Configurable language exclusions
- Manual command for trimming whitespace

---

## Rebuild the Extension

To rebuild the extension, run the following commands:

```
pnpm run compile
pnpm run esbuild
```

Or use:

```
rm -rf out dist
pnpm run vscode:prepublish
```

Close and reopen Windsurf to load the updated extension.

## Create a VSIX file

```
vsce package --no-dependencies
```

**Enjoy!**
