# pommeau-filtrant.fr

French online shop of filtering shower heads, shower filters and their refills, built with Next.js. Everything about the project (what it
is, the map of the code, the rules, Git and deployment) is in [CLAUDE.md](CLAUDE.md): read it first.

```bash
npm install
cp .env.example .env.local      # nothing in it is required to run the site locally
npm run dev                     # http://localhost:3000
npm run lint && node scripts/check-content.mjs && npm run build   # before every push
```

Launch guide (DNS, Stripe, VPS, Search Console): [docs/mise-en-ligne.md](docs/mise-en-ligne.md).
