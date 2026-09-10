# Nendu Cloud

**A personal cloud storage workspace by [Nendran Duke](https://github.com/nendrandukes-bit).**

Live site → **https://nendrandukes-bit.github.io/Storage/**

Nendu Cloud keeps every kind of file in one organised place — **photos, videos, documents,
APKs, audio, archives and code** — with instant search across the whole drive, in-browser
preview for each type, and one-click download. No account, no third-party upload, no
tracking: the site is a static bundle that lives on GitHub Pages, and anything you drop on
the page is stored only inside your own browser.

---

## What it does

| Feature | How it works |
| --- | --- |
| **Category sections** | Sidebar folders for Photos, Videos, Documents, APK & Apps, Audio, Archives, Code and Other — each with a live file counter, plus an “All files” view. |
| **Search bar** | One box searches *everything*: file names, name stems, extensions, tags, descriptions and folder names. It scores matches (prefix > token > substring > typo-tolerant), highlights hits in-place, shows a suggestions dropdown, and works with type chips (PNG, MP4, APK …) to narrow results. Press `/` to jump to it. |
| **Preview** | Images with click-to-zoom + dimensions, videos with a real player (plus speed controls), audio with an inline player, Markdown rendered or raw, text/code with line numbers, wrap and syntax highlighting, PDF/HTML in an embedded frame, Office documents via the Microsoft viewer, APKs and archives with a hex header dump, and ZIP archives listing their real central-directory entries. |
| **Download** | Every file, in every view, downloads byte-for-byte with its original filename — from the card, from the preview panel, or via keyboard (`d`). |
| **Uploads** | Drag & drop, paste, or the Upload button. Files go into IndexedDB (browser storage), get thumbnails generated from real image/video frames, are auto-sorted into the right category and become searchable like published files. |
| **Integrity** | Each file's SHA-256 is computed locally so APK/archive installs can be verified. |
| **Quality of life** | Dark + light themes, grid/list layouts, sort by name/date/size/type, share links that deep-link straight into a preview (`?f=…`), storage meter, and a starred shortcut. |

## Repo layout

```
index.html              the whole app (one page)
css/styles.css          design system, both themes, responsive rules
js/app.js               categories · search · previews · downloads · uploads
js/store.js             IndexedDB wrapper (the browser-side “cloud node”)
js/manifest.js          the published library — one entry per repo file
files/<category>/       your files live here (photos, videos, docs, apk, audio, archives, code)
tools/build-manifest.js regenerates js/manifest.js from the files/ folders
thumbs/<category>/         build-time image/video thumbnails (generated when ffmpeg exists)
tools/validate.js       pre-flight check: missing files, dupes, bad categories, orphans
.nojekyll               skips Jekyll so Paths / serve from main
```

## Starter library

The drive ships with 7 tiny demo files (≈320 KB total) — one per category — so search,
preview and download are demonstrable immediately. Delete them and republish with:

```bash
rm -rf files/*/* && touch files/photos/.gitkeep files/videos/.gitkeep files/docs/.gitkeep        files/apk/.gitkeep files/audio/.gitkeep files/archives/.gitkeep files/code/.gitkeep        files/other/.gitkeep
npm run build:manifest && npm run validate && git add -A && git commit -m "start with an empty drive" && git push
```

## Add files permanently (published to the link)

1. Drop your file in the matching folder, e.g. `files/photos/sunset-climb.jpg`.
2. Regenerate the index:

   ```bash
   npm run build:manifest   # scans files/ and rewrites js/manifest.js
   npm run validate         # fails if a listed file is missing, duplicated or misplaced
   ```

3. Commit and push. Pages republishes in about a minute.

If `ffmpeg` is on your machine, `build:manifest` also renders a 480 px frame thumbnail for
every photo and video into `thumbs/` and links it with `thumbPath`, so the grid shows real
pictures instead of icons. Without ffmpeg the app grabs a frame in the browser on first view.

Or hand-write the entry in `js/manifest.js`:

```js
window.CLOUD_MANIFEST = [
  {
    id: "photo-sunset-climb",
    name: "sunset-climb.jpg",
    category: "photos",              // photos · videos · docs · apk · audio · archives · code · other
    path: "files/photos/sunset-climb.jpg",
    size: 248531,                    // bytes — lets the UI show sizes without a network probe
    modified: "2026-08-14",
    description: "Golden hour on the ridge.",
    tags: ["sunset", "hike"],
    starred: true
  }
];
```

Only `name`, `category` and `path` are required; sizes and dates are filled in from the file
system by the builder. GitHub accepts files up to 100 MB per commit path (25 MB is comfortable
for Pages caching); for a big video library, host the media elsewhere and point `path` at it —
previews and downloads both accept absolute URLs.

## Keep files on your device only

Drag them onto the page. They are written to IndexedDB (`nendu-cloud` database), survive
reload, and never leave the browser. Use **Export manifest** in the header to download a
`manifest.js` that lists those files with ready-made `files/<category>/…` paths, then commit
the files plus that manifest to publish them for everyone who has the link. Removing a
browser-only file never touches the repository copy.

## Running it locally

```bash
npm run serve        # python3 -m http.server 8080
# open http://127.0.0.1:8080
```

A real HTTP origin is required for IndexedDB + `fetch` previews (opening `index.html` from
the filesystem works for browsing, but previews of repo files need a server).

## Checks

`npm run check` validates the manifest and parses all scripts. Two Playwright suites cover
the running site — boot, upload → storage → thumbnail, category counters, search scoring,
every preview type, download bytes, IndexedDB persistence, share deep links, manifest export,
themes, responsive drawer, delete confirmation, and the full `files/ → build:manifest →
served` publish loop including a `validate` failure case. They live outside the published
bundle (see `.gitignore`).

## Notes

* Zero dependencies, zero build step: the site works on any static host, not just Pages.
* Nothing is uploaded to a third party. Drag & drop, hashing, thumbnails and search all run
  client-side; the only network requests are for your own files.
* Files are public to anyone with the URL, since GitHub Pages is a public web server — keep
  private things in the browser-only path.

---

© Nendran Duke · MIT licensed.
