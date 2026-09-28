# useFetch — Custom React Hook Demo

A small, well-documented React app demonstrating a reusable **`useFetch`**
custom hook. It fetches data from an API and displays it in a responsive,
polished grid, following the standard `data` / `loading` / `error` pattern.

## Live Demo

- **Netlify:** _add your deployed link here_
- **GitHub:** _add your repo link here_

---

## Features

- ✅ Reusable `useFetch(url)` hook — works with any JSON API
- ✅ Loading, error, and empty states handled explicitly
- ✅ Automatic request cancellation (no race conditions, no memory leaks)
- ✅ Manual `refetch()` support (used by the "Try again" button)
- ✅ Skeleton-loading grid instead of a blank spinner
- ✅ Responsive, accessible product grid UI
- ✅ Broken image fallback handling
- ✅ Runs on the latest stable Node.js, React, and Vite

---

## Tech Stack

| Tool          | Version    | Notes                                   |
|---------------|-----------|-------------------------------------------|
| React         | 19.2.x    | Latest stable major release               |
| Vite          | 8.x       | Build tool / dev server                   |
| Node.js       | ≥ 20.19   | Also tested on Node 22 LTS and Node 24 LTS |
| ESLint        | 9.x       | Flat config, `react-hooks` rules enabled  |

> Vite 8 requires Node.js `20.19+` or `22.12+`. If you're on an older
> Node version, upgrade first (`node -v` to check).

---

## Project Structure

```
usefetch-app/
├── src/
│   ├── hooks/
│   │   └── useFetch.js        # the custom hook
│   ├── components/
│   │   ├── ProductList.jsx    # consumes useFetch, renders the grid
│   │   └── ProductList.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── _redirects             # Netlify SPA routing fallback
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## How the hook works

```js
const { data, loading, error, refetch } = useFetch(url);
```

| Hook used     | Why                                                                 |
|---------------|----------------------------------------------------------------------|
| `useState`    | Holds `data`, `loading`, and `error`.                                |
| `useCallback` | Keeps the fetch function referentially stable so it can be reused as `refetch()` and safely listed as a `useEffect` dependency. |
| `useEffect`   | Triggers the fetch whenever `url` changes.                           |
| `useRef`      | Stores an `AbortController` so a stale, in-flight request can be cancelled if the URL changes again or the component unmounts. |

The hook validates its input (rejects empty/non-string URLs), checks
`response.ok` explicitly (since `fetch()` doesn't throw on HTTP error
codes like 404/500), and distinguishes an intentionally aborted request
from a real error.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Lint the code
npm run lint

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview
```

---

## API Used

[EscuelaJS Fake Store API](https://api.escuelajs.co/api/v1/products) —
a public dummy product API. No API key required.

---

## Deploying

### GitHub
```bash
git init
git add .
git commit -m "Initial commit: useFetch custom hook demo"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Netlify
1. In Netlify: **Add new site → Import an existing project** and connect
   your GitHub repo.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy — Netlify will rebuild automatically on every push to `main`.

(The included `public/_redirects` file ensures client-side routing
works correctly if you add routes later.)

---

## Security & Reliability Notes

- No API keys, secrets, or credentials are used or stored in this
  project; `.env*` files are git-ignored by default in case you add
  environment variables later.
- All network requests use HTTPS.
- In-flight requests are cancelled via `AbortController` when the
  component unmounts or the URL changes, preventing state updates on
  unmounted components and stale-response race conditions.
- Image `src` values fall back to a safe placeholder if the API
  returns a broken or missing image URL.

---

## Decisions Made During Development

1. **`useCallback` + `useRef(AbortController)`** — chosen over a plain
   `useEffect` fetch so the hook can expose a working `refetch()` and
   avoid race conditions between successive requests.
2. **Explicit `response.ok` check** — `fetch()` only rejects on network
   failure, not on HTTP error status codes, so this check is necessary
   to correctly surface 404/500-style errors to the UI.
3. **Skeleton grid instead of a spinner** — gives a more polished,
   layout-stable loading experience and avoids content "jumping" once
   real data arrives.
4. **Component split** — `useFetch` (data logic) is fully decoupled
   from `ProductList` (presentation), so the hook can be reused with
   any other API/component.
5. **Plain CSS, no framework** — keeps the project dependency-light and
   easy for a reviewer to read end-to-end.
6. **ESLint with `react-hooks` rules** — catches missing dependency
   arrays and other common hook mistakes automatically.

---

## License

This project was created for educational/assignment purposes.
