# Math Tooter 💨

> Multiplication practice — the tooty way.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to Netlify

### Option A — Drag and drop (fastest)

1. Run `npm run build` locally
2. Drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Done — you'll get a live URL instantly.

### Option B — GitHub + Netlify CI (recommended)

1. Push this project to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect your GitHub repo
4. Netlify auto-detects the `netlify.toml` — build settings are already configured:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**

Every push to `main` will auto-deploy. Pull requests get deploy previews.

### Option C — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

## Project structure

```
math-tooter/
├── index.html          # Entry point with mobile viewport meta
├── netlify.toml        # Netlify build + redirect config
├── vite.config.js      # Vite config
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # React root
    ├── index.css       # Global reset
    ├── App.jsx         # Main app + all components
    ├── App.module.css  # Mobile-first CSS modules
    └── farts.js        # 6-variation fart sound synthesizer
```

## Fart sounds

All sounds are synthesized via the Web Audio API — no audio files needed.
Six distinct variations are randomized on each correct answer:
- Classic wet toot
- Short squeaker
- Long rumbler
- Sputtering machine gun
- Airy whoopee cushion
- Surprised squeal
