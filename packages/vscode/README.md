# Route Intelligence for VS Code

VS Code extension: analyze the open workspace, show a route tree in Explorer, hover/go-to-definition on `href`, and surface analyzer diagnostics.

**This is not an npm CLI.** Publish with `vsce` to the VS Code Marketplace. `changeset publish` should not treat it as a library users `npm install`.

## Requirements

- VS Code `^1.90.0`
- A Next.js workspace (the extension hard-codes `NextPlugin()`)

## Features

- **Command:** `Route Intelligence: Analyze Project` (`route-intelligence.analyze`)
- **Command:** `Route Intelligence: Show Route Graph` (`route-intelligence.showGraph`) — placeholder webview; full graph UI is `npx route-intelligence graph`
- **Explorer view:** `Route Intelligence` tree of routes and inbound/outbound navigation
- **Hover** on `href="..."` — path, type, file, dead-route warning
- **Go to Definition** on `href` — jumps to the route file
- **Diagnostics** collection `route-intelligence` from analyzer findings
- Re-analyzes on save of `ts` / `tsx` / `js` / `jsx`

## Develop locally

From the monorepo root:

```bash
npm install
npm run build
```

Then in VS Code: Run Extension (F5) with this folder, or copy `packages/vscode` into `.vscode/extensions` after build (`dist/extension.js` is `main`).

## Marketplace publish

```bash
cd packages/vscode
npx vsce package
npx vsce publish
```

Requires a publisher id matching `"publisher": "route-intelligence"` in `package.json` (or change it).

## License

MIT
