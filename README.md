# JOJTY'S UNIVERSE

A standalone, client-side React birthday website. All five scenes, their messages and transitions, the star-collecting mini-game, touch controls, replay, and browser-local progress are included.

## Run on Windows with VS Code

1. Install **Node.js 22.12 or newer**.
2. Extract this ZIP file, then open the `jojtys-universe-local` folder in VS Code.
3. In VS Code, open **Terminal → New Terminal** and run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open the local address printed by Vite (normally `http://localhost:5173/`).

## Production build

```powershell
npm run build
```

The static website is written to `dist/`. To preview that build locally, run `npm run preview`.

The project has no backend, database, login, Replit service, or required environment variables. Scene/star progress is stored in the browser's local storage; the website's replay control clears it. The original Google Fonts import remains in the stylesheet, with local font fallbacks if those fonts cannot be reached.
