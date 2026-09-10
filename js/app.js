/* =========================================================
   Nendu Cloud — cloud storage by Nendran Duke
   js/app.js  ·  categories · search · preview · download · upload
   No frameworks, no CDNs, no network calls other than to this
   repo's own files. Your private uploads stay in IndexedDB.
   ========================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 1. Categories
   * ------------------------------------------------------------------ */
  var ICON_PATHS = {
    cloud: '<path d="M6.6 18.4A4 4 0 0 1 7 10.5a5.9 5.9 0 0 1 11.3 1.5A3.6 3.6 0 0 1 17.8 18.4z"/><path d="M12 15.6V9.8m0 0-2 2m2-2 2 2"/>',
    photos: '<rect x="3" y="5" width="18" height="14" rx="2.6"/><circle cx="8.6" cy="10.2" r="1.7"/><path d="m4.2 17.4 4.6-4.2a2 2 0 0 1 2.6 0l4.3 3.9m-1.2-2.1 1.5-1.4a2 2 0 0 1 2.6 0l.6.5"/>',
    videos: '<rect x="2.6" y="5.6" width="12.8" height="12.8" rx="2.6"/><path d="m15.4 10.6 4.5-2.7a.9.9 0 0 1 1.4.8v6.6a.9.9 0 0 1-1.4.8l-4.5-2.7z"/>',
    docs: '<path d="M14 3.2H7.6A2.4 2.4 0 0 0 5.2 5.6v12.8a2.4 2.4 0 0 0 2.4 2.4h8.8a2.4 2.4 0 0 0 2.4-2.4V8z"/><path d="M14 3.2V8h4.4M8.8 12.4h6.4M8.8 15.8h4.6"/>',
    apk: '<path d="m12 3.6 7.6 3.1v5.6c0 4.1-3 6.9-7.6 8.1-4.6-1.2-7.6-4-7.6-8.1V6.7z"/><path d="m9.1 12 2 2 3.9-4"/>',
    audio: '<path d="M9.2 17.4V6.2l9.2-1.9v11"/><circle cx="6.6" cy="17.4" r="2.6"/><circle cx="15.8" cy="15.3" r="2.6"/>',
    archives: '<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.4"/><path d="M3.2 9.2h17.6M12 4.2v5"/><path d="M10.6 13.4h2.8v2.4h-2.8z"/>',
    code: '<path d="m8.4 8.6-4.2 3.6 4.2 3.6M15.6 8.6l4.2 3.6-4.2 3.6M13.6 5.2l-3.2 14"/>',
    other: '<path d="M13.4 2.9H7.2A2.3 2.3 0 0 0 4.9 5.2v13.6a2.3 2.3 0 0 0 2.3 2.3h9.6a2.3 2.3 0 0 0 2.3-2.3V8.2z"/><path d="M13.4 2.9v5.3h5.7"/>',
    all: '<rect x="3.4" y="3.4" width="7" height="7" rx="1.8"/><rect x="13.6" y="3.4" width="7" height="7" rx="1.8"/><rect x="3.4" y="13.6" width="7" height="7" rx="1.8"/><rect x="13.6" y="13.6" width="7" height="7" rx="1.8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    download: '<path d="M12 3.6v11.6m0 0 4.2-4.2M12 15.2l-4.2-4.2"/><path d="M4.4 17v1.6a2.2 2.2 0 0 0 2.2 2.2h10.8a2.2 2.2 0 0 0 2.2-2.2V17"/>',
    eye: '<path d="M2.6 12S5.9 6 12 6s9.4 6 9.4 6-3.3 6-9.4 6-9.4-6-9.4-6z"/><circle cx="12" cy="12" r="2.7"/>',
    link: '<path d="M9.8 14.2a3.6 3.6 0 0 0 5.1 0l3.4-3.4a3.6 3.6 0 0 0-5.1-5.1L11.8 7.1"/><path d="M14.2 9.8a3.6 3.6 0 0 0-5.1 0l-3.4 3.4a3.6 3.6 0 0 0 5.1 5.1l1.4-1.4"/>',
    trash: '<path d="M4.8 6.6h14.4M9.4 6.6V4.8h5.2v1.8M6.4 6.6l.9 12a1.8 1.8 0 0 0 1.8 1.6h5.8a1.8 1.8 0 0 0 1.8-1.6l.9-12"/>',
    check: '<path d="m5 12.6 4.4 4.4L19 7.4"/>',
    x: '<path d="M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8"/>',
    upload: '<path d="M12 19.4V7.2m0 0L7.4 11.8M12 7.2l4.6 4.6"/><path d="M4.6 16v2.2A2.2 2.2 0 0 0 6.8 20.4h10.4a2.2 2.2 0 0 0 2.2-2.2V16"/>',
    file: '<path d="M13.6 3.4H7.4a2.2 2.2 0 0 0-2.2 2.2v12.8a2.2 2.2 0 0 0 2.2 2.2h9.2a2.2 2.2 0 0 0 2.2-2.2V8.4z"/><path d="M13.6 3.4v5h5"/>',
    image: '<rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.4"/><circle cx="9" cy="10" r="1.8"/><path d="m4.6 17.4 4.8-4.4 3.4 3 3-2.4 4.2 3.8"/>',
    text: '<path d="M13.6 3.4H7.4a2.2 2.2 0 0 0-2.2 2.2v12.8a2.2 2.2 0 0 0 2.2 2.2h9.2a2.2 2.2 0 0 0 2.2-2.2V8.4z"/><path d="M13.6 3.4v5h5M8.8 12.6h6.4M8.8 15.6h6.4M8.8 18.4h4"/>',
    pdf: '<path d="M13.6 3.4H7.4a2.2 2.2 0 0 0-2.2 2.2v12.8a2.2 2.2 0 0 0 2.2 2.2h9.2a2.2 2.2 0 0 0 2.2-2.2V8.4z"/><path d="M13.6 3.4v5h5M8.4 17.2c2.6-.8 4-3.4 3.4-4.6-.7-1.3-2.2.4-1.4 2.4.9 2.3 3 3.4 4.4 3"/>',
    play: '<path d="M8 5.4v13.2l11-6.6z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4 7 7m10 10 1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"/>',
    moon: '<path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4z"/>',
    folder: '<path d="M3.6 7.2a2 2 0 0 1 2-2h3.2l2 2.4h7.6a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2h-12.8a2 2 0 0 1-2-2z"/>',
    sparkle: '<path d="M12 3.4l1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9z"/><path d="M19.2 4.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    zip: '<rect x="4" y="3.6" width="16" height="16.8" rx="2.4"/><path d="M12 3.6v3.2M12 8.4v1.6M12 11.6V15a1.6 1.6 0 0 0 3.2 0"/>',
    copy: '<rect x="8.6" y="8.6" width="11.8" height="11.8" rx="2.2"/><path d="M15.4 5.6V4.8a2 2 0 0 0-2-2H5.8a2 2 0 0 0-2 2v7.6a2 2 0 0 0 2 2h.8"/>'
  };

  var CATEGORIES = [
    { id: 'photos',   label: 'Photos',    color: '#5ec8f0', icon: 'photos',
      blurb: 'Camera rolls, screenshots and renders — previewed at full size with zoom.',
      exts: 'jpg jpeg png webp gif bmp avif heic heif svg tif tiff ico raw dng cr2 nef'.split(' ') },
    { id: 'videos',   label: 'Videos',    color: '#ff8fab', icon: 'videos',
      blurb: 'Streaming playback with captions, thumbnails generated from the first frame.',
      exts: 'mp4 m4v mov mkv webm avi wmv flv mpg mpeg 3gp'.split(' ') },
    { id: 'docs',     label: 'Documents', color: '#ffd95e', icon: 'docs',
      blurb: 'PDFs, Word, Excel, slides, Markdown and plain text — read them in the browser.',
      exts: 'pdf doc docx xls xlsx ppt pptx odt ods odp rtf txt md markdown csv tsv json xml yaml yml log ini epub'.split(' ') },
    { id: 'apk',      label: 'APK & Apps',color: '#8be3a0', icon: 'apk',
      blurb: 'Android packages with integrity hashes so installs can be verified.',
      exts: 'apk xapk apks aab apkm ipa apk.1'.split(' ') },
    { id: 'audio',    label: 'Audio',     color: '#b693ff', icon: 'audio',
      blurb: 'Music, podcasts and voice notes with inline playback.',
      exts: 'mp3 m4a aac wav flac ogg oga opus amr aiff mid wma'.split(' ') },
    { id: 'archives', label: 'Archives',  color: '#f6a85c', icon: 'archives',
      blurb: 'Zip, Rar, 7z and disk images, listed and downloaded in one click.',
      exts: 'zip rar 7z tar gz tgz bz2 xz zst iso img cab jar'.split(' ') },
    { id: 'code',     label: 'Code',      color: '#7fd6c6', icon: 'code',
      blurb: 'Scripts, source dumps and builds — syntax-highlighted preview.',
      exts: 'js mjs cjs ts tsx jsx html htm css scss py rb go rs java kt swift c h cpp php pl lua sh bash zsh sql dart vue svelte toml env gitignore'.split(' ') },
    { id: 'other',    label: 'Other',     color: '#9fb0c6', icon: 'other',
      blurb: 'Everything that does not fit a folder yet — still searchable.',
      exts: [] }
  ];

  var CAT = {};
  CATEGORIES.forEach(function (c, i) { c.order = i; CAT[c.id] = c; });
  CAT.all = { id: 'all', label: 'All files', color: '#ffd95e', icon: 'all',
    blurb: 'Everything in the drive, searchable in one place.' };

  var EXT2CAT = {};
  CATEGORIES.forEach(function (c) { c.exts.forEach(function (e) { EXT2CAT[e] = c.id; }); });

  var TEXTY = 'txt md markdown csv tsv json xml yaml yml log ini env js mjs cjs ts tsx jsx css scss html htm py rb go rs java kt swift c h cpp cc php pl lua sh bash zsh sql toml svelte vue gitignore properties conf cfg'.split(' ');
  var CODEY = 'js mjs cjs ts tsx jsx css scss html htm json py rb go rs java kt swift c cpp cc h php pl lua sh bash zsql sql toml svelte vue'.split(' ');
  var MAX_UPLOAD = 128 * 1024 * 1024;   // per file, browser storage
  var MAX_INLINE_TEXT = 1.6 * 1024 * 1024;
  var MAX_HEX = 96 * 1024;
  var MAX_HASH = 128 * 1024 * 1024;
  var STORE_KEY = 'nendu-cloud:view';

  /* ------------------------------------------------------------------ *
   * 2. Small helpers
   * ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function svg(name, cls) {
    var ico = '<svg viewBox="0 0 24 24" class="' + (cls || 'ic') + '" aria-hidden="true">' + (ICON_PATHS[name] || ICON_PATHS.file) + '</svg>';
    return ico.replace('<svg ', '<svg fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ');
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (v === true) node.setAttribute(k, '');
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : children ? [children] : []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function bytes(n) {
    if (!isFinite(n) || n <= 0) return n === 0 ? '0 B' : '—';
    var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0, v = n;
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    return (v >= 100 || i === 0 ? Math.round(v) : v.toFixed(v >= 10 ? 1 : 2)) + ' ' + u[i];
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function fmtDateTime(ms) {
    if (!ms) return '—';
    return new Date(ms).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function rel(iso) {
    var t = new Date(iso).getTime();
    if (!isFinite(t)) return '';
    var days = Math.round((Date.now() - t) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return days + ' days ago';
    if (days < 365) return Math.round(days / 30) + ' mo ago';
    return Math.round(days / 365) + ' yr ago';
  }

  function extOf(name) {
    var base = String(name || '').split('/').pop();
    var i = base.lastIndexOf('.');
    if (i <= 0 || i === base.length - 1) return '';
    var e = base.slice(i + 1).toLowerCase();
    return /^[a-z0-9][a-z0-9.+_-]{0,9}$/.test(e) ? e : '';
  }
  function baseOf(name) { return String(name || '').replace(/\.[^.]*$/, ''); }
  function catOf(f) { return CAT[f.category] || CAT.other; }

  function tokens(name) {
    return baseOf(name)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_\-.]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(function (t) { return t.toLowerCase(); });
  }

  /* ------------------------------------------------------------------ *
   * 3. State
   * ------------------------------------------------------------------ */
  var state = {
    cat: 'all',
    q: '',
    type: '',
    sort: 'newest',
    view: 'grid',
    theme: 'dark',
    repoFiles: [],
    localFiles: [],
    byId: {},
    activeId: null,
    localReady: false,
    lastFocus: null,
    pendingNav: false
  };

  var blobCache = new Map();   // id -> Promise<{blob, url}>
  var blobLru = [];            // keep at most 2 files resident
  var objectURLs = [];

  function remember(id, pair) {
    blobLru.push(id);
    while (blobLru.length > 2) {
      var drop = blobLru.shift();
      if (drop !== id) blobCache.delete(drop);
    }
    return pair;
  }

  function getBlob(f) {
    if (blobCache.has(f.id)) return blobCache.get(f.id);
    var p = (f.source === 'local'
      ? NenduStore.blob(f.uid).then(function (b) {
          if (!b) throw new Error('This file is no longer in local storage.');
          return b;
        })
      : fetch(f.url, { cache: 'force-cache' }).then(function (r) {
          if (!r.ok) throw new Error('Could not load this file from the repo (HTTP ' + r.status + ').');
          return r.blob();
        })
    ).then(function (blob) {
      var url = URL.createObjectURL(blob);
      objectURLs.push(url);
      return remember(f.id, { blob: blob, url: url });
    }).catch(function (err) {
      blobCache.delete(f.id);
      throw err;
    });
    blobCache.set(f.id, p);
    return p;
  }

  function getBlobUrl(f) { return getBlob(f).then(function (x) { return x.url; }); }

  function hashBlob(blob) {
    if (!crypto || !crypto.subtle || !crypto.subtle.digest) return Promise.resolve(null);
    if (blob.size > MAX_HASH) return Promise.resolve('too-big');
    return blob.arrayBuffer().then(function (buf) {
      return crypto.subtle.digest('SHA-256', buf);
    }).then(function (d) {
      return Array.prototype.map.call(new Uint8Array(d), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. File list building
   * ------------------------------------------------------------------ */
  function normalise(entry, source) {
    var ext = (entry.ext || extOf(entry.name)).toLowerCase();
    var cat = entry.category && CAT[entry.category] ? entry.category : (EXT2CAT[ext] || 'other');
    var path = entry.path || 'files/' + cat + '/' + entry.name;
    var f = {
      id: source + ':' + (entry.id || path),
      uid: entry.id || path,
      name: entry.name,
      ext: ext,
      category: cat,
      path: path,
      url: entry.url || (source === 'repo' ? path : ''),
      size: Number(entry.size) || 0,
      date: entry.date || entry.modified || (source === 'local' ? new Date(entry.updatedAt || Date.now()).toISOString() : ''),
      description: entry.description || '',
      tags: entry.tags || [],
      starred: !!entry.starred,
      thumb: entry.thumb || '',
      source: source,
      blobType: entry.blobType || ''
    };
    f.search = (f.name + ' ' + f.tags.join(' ') + ' ' + (f.description || '') + ' ' + CAT[cat].label + ' ' + f.ext).toLowerCase();
    f.tokens = tokens(f.name);
    if (f.ext) f.tokens.push(f.ext);
    return f;
  }

  function loadRepo() {
    state.repoFiles = (window.CLOUD_MANIFEST || []).map(function (e) { return normalise(e, 'repo'); });
    if (!state.repoFiles.length) return;
    // measure real sizes / dates for repo files with a HEAD request (best effort)
    state.repoFiles.forEach(function (f) {
      if (f.size) return;
      fetch(f.url, { method: 'HEAD' }).then(function (r) {
        var len = r.headers.get('content-length');
        if (len && !f.size) { f.size = Number(len) || 0; render(); }
      }).catch(function () {});
    });
  }

  function loadLocal() {
    return NenduStore.all().then(function (rows) {
      state.localFiles = (rows || []).map(function (r) { return normalise(r, 'local'); });
      state.localReady = true;
    }).catch(function (err) {
      state.localFiles = [];
      state.localReady = true;
      console.warn('[nendu] local storage unavailable:', err);
    });
  }

  function allFiles() { return state.repoFiles.concat(state.localFiles); }
  function fileById(id) { return state.byId[id]; }

  function visibleFiles() {
    var list = allFiles();
    if (state.cat !== 'all') list = list.filter(function (f) { return f.category === state.cat; });
    if (state.type) list = list.filter(function (f) { return f.ext === state.type; });
    list = list.slice();
    var s = state.sort;
    list.sort(function (a, b) {
      switch (s) {
        case 'name': return a.name.localeCompare(b.name, undefined, { numeric: true });
        case 'name-desc': return b.name.localeCompare(a.name, undefined, { numeric: true });
        case 'largest': return b.size - a.size;
        case 'smallest': return a.size - b.size;
        case 'oldest': return new Date(a.date || 0) - new Date(b.date || 0);
        case 'type': return (a.ext || '').localeCompare(b.ext || '') || a.name.localeCompare(b.name);
        default: return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });
    return list;
  }

  /* ------------------------------------------------------------------ *
   * 5. Search / scoring
   * ------------------------------------------------------------------ */
  function score(f, q) {
    var hay = f.search;
    var s = 0;
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t) continue;
      var hit = 0;
      if (f.name.toLowerCase().indexOf(t) === 0) hit = 60;
      else if (f.name.toLowerCase().indexOf(t) > 0) hit = 40;
      else if (f.tokens.some(function (tk) { return tk.indexOf(t) === 0; })) hit = 30;
      else if (f.tokens.some(function (tk) { return tk.indexOf(t) > 0; })) hit = 20;
      else if (f.ext === t.replace(/^\./, '')) hit = 18;
      else if (CAT[f.category].label.toLowerCase().indexOf(t) === 0) hit = 12;
      else if (hay.indexOf(t) >= 0) hit = 8;
      else if (t.length >= 4) {
        // typo tolerance on name tokens
        var near = f.tokens.some(function (tk) { return tk.length > 3 && lev(tk, t) <= 2; });
        if (near) hit = 6;
      }
      if (!hit) return 0;
      s += hit;
    }
    if (f.starred) s += 3;
    return s;
  }

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 99;
    var m = a.length, n = b.length, prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur.slice();
    }
    return prev[n];
  }

  function search(q, limit) {
    var list = allFiles().map(function (f) { return { f: f, s: score(f, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s || a.f.name.localeCompare(b.f.name); });
    return list.slice(0, limit || 60);
  }

  function highlight(text, q) {
    var frag = document.createDocumentFragment();
    var terms = (q || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) { frag.appendChild(document.createTextNode(text)); return frag; }
    var lower = text.toLowerCase();
    var marks = [];
    terms.forEach(function (t) {
      var i = lower.indexOf(t);
      while (i >= 0) { marks.push([i, i + t.length]); i = lower.indexOf(t, i + 1); }
    });
    if (!marks.length) { frag.appendChild(document.createTextNode(text)); return frag; }
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var pos = 0;
    marks.forEach(function (m) {
      if (m[0] < pos) return;
      if (m[0] > pos) frag.appendChild(document.createTextNode(text.slice(pos, m[0])));
      var mk = document.createElement('mark');
      mk.textContent = text.slice(m[0], m[1]);
      frag.appendChild(mk);
      pos = m[1];
    });
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    return frag;
  }

  /* ------------------------------------------------------------------ *
   * 6. Sidebar + header rendering
   * ------------------------------------------------------------------ */
  function counts() {
    var c = { all: 0 };
    allFiles().forEach(function (f) {
      c.all++;
      c[f.category] = (c[f.category] || 0) + 1;
    });
    return c;
  }

  function renderNav() {
    var nav = $('#nav');
    var c = counts();
    nav.innerHTML = '';
    nav.appendChild(el('div', { class: 'nav-title', text: 'Library' }));
    [CAT.all].concat(CATEGORIES).forEach(function (cat) {
      var btn = el('button', {
        class: 'nav-item', type: 'button', 'aria-current': state.cat === cat.id ? 'true' : 'false',
        style: { '--cat': cat.color }, 'data-cat': cat.id,
        title: cat.blurb
      }, [
        el('span', { class: 'nav-ic', html: svg(cat.icon, 'ic') }),
        el('span', { class: 'nav-label', text: cat.label }),
        el('span', { class: 'nav-count', text: String(c[cat.id] || 0) })
      ]);
      btn.addEventListener('click', function () { setCat(cat.id); });
      nav.appendChild(btn);
    });

    nav.appendChild(el('div', { class: 'nav-title', text: 'Shortcuts' }));
    var shortcuts = el('div', { class: 'nav' });
    shortcuts.appendChild(elRow('Starred only', 'sparkle', function () {
      toggleStarFilter();
    }, state.starOnly));
    nav.appendChild(shortcuts);
  }

  function elRow(label, icon, onClick, on) {
    var b = el('button', { class: 'nav-item', type: 'button', 'aria-current': on ? 'true' : 'false', style: { '--cat': '#ffd95e' } }, [
      el('span', { class: 'nav-ic', html: svg(icon, 'ic') }),
      el('span', { class: 'nav-label', text: label })
    ]);
    b.addEventListener('click', onClick);
    return b;
  }

  var starFilterOn = false;
  function toggleStarFilter() {
    starFilterOn = !starFilterOn;
    render();
    toast(starFilterOn ? 'Showing starred files only' : 'Showing everything');
  }

  function renderHero() {
    var cat = CAT[state.cat];
    var list = visibleFiles();
    $('#cat-title').textContent = cat.label;
    $('#cat-sub').textContent = cat.blurb;
    var totalSize = list.reduce(function (a, f) { return a + (f.size || 0); }, 0);
    var bits = [];
    if (state.q) bits.push('searching for <b>“' + esc(state.q) + '”</b>');
    bits.push('<b>' + list.length + '</b> ' + (list.length === 1 ? 'item' : 'items'));
    if (totalSize) bits.push('<b>' + bytes(totalSize) + '</b>');
    $('#search-status').innerHTML = bits.join(' · ');
    document.title = (state.cat === 'all' ? 'Nendu Cloud' : cat.label + ' · Nendu Cloud') + ' — cloud storage by Nendran Duke';
    renderTypeChips(list);
  }

  function renderTypeChips(list) {
    var wrap = $('#type-chips');
    var tally = {};
    list.forEach(function (f) { if (f.ext) tally[f.ext] = (tally[f.ext] || 0) + 1; });
    var keys = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).slice(0, 10);
    wrap.innerHTML = '';
    if (!keys.length) return;
    var mk = function (ext, label) {
      var b = el('button', { class: 'chip', type: 'button', 'aria-pressed': (state.type === ext) ? 'true' : 'false' }, [label]);
      if (tally[ext]) b.appendChild(el('span', { class: 'n', text: tally[ext] }));
      b.addEventListener('click', function () {
        state.type = state.type === ext ? '' : ext;
        saveState(); render();
      });
      return b;
    };
    if (state.type) wrap.appendChild(mk('', 'All types'));
    keys.forEach(function (k) { wrap.appendChild(mk(k, k.toUpperCase())); });
  }

  /* ------------------------------------------------------------------ *
   * 7. Cards
   * ------------------------------------------------------------------ */
  function thumbHTML(f) {
    var cat = catOf(f);
    if (f.thumb) return '<img src="' + esc(f.thumb) + '" alt="" loading="lazy">';
    var isMedia = cat.id === 'photos' || (cat.id === 'videos');
    var icon = isMedia ? 'image' : (cat.id === 'videos' ? 'videos' : cat.icon);
    if (f.ext === 'pdf') icon = 'pdf';
    else if (['zip','rar','7z','tar','gz','tgz','bz2','xz','zst','jar','cab'].indexOf(f.ext) >= 0) icon = 'zip';
    else if (cat.id === 'docs' && TEXTY.indexOf(f.ext) >= 0) icon = 'text';
    else if (cat.id === 'code') icon = 'code';
    else if (cat.id === 'archives') icon = 'zip';
    else if (cat.id === 'audio') icon = 'audio';
    else if (cat.id === 'apk') icon = 'apk';
    var tint = 'color-mix(in srgb,' + cat.color + ' 14%,transparent)';
    var inner = '<span class="glyph">' + svg(icon, '') + '</span>' +
      '<span class="tile-label">' + (cat.id === 'other' ? 'file' : cat.label.replace(' & Apps', '').toLowerCase()) + '</span>';
    return '<div class="tile-bg" style="background:radial-gradient(120% 90% at 50% 105%,' + tint + ',transparent 65%)"></div>' + inner;
  }

  function cardEl(f, i) {
    var cat = catOf(f);
    var thumb = el('div', { class: 'thumb', style: { '--cat': cat.color } });
    thumb.innerHTML = thumbHTML(f);
    if (f.ext) thumb.appendChild(el('span', { class: 'ext', text: f.ext.toUpperCase() }));
    if (cat.id === 'videos') thumb.appendChild(el('span', { class: 'play', html: svg('play', 'play-svg') }));
    if (f.source === 'local') thumb.appendChild(el('span', { class: 'local-dot', title: 'Stored in this browser', html: svg('cloud', 'ic') + 'Local' }));

    var name = el('h3', { class: 'c-name', title: f.name });
    var stem = f.ext ? f.name.slice(0, f.name.length - f.ext.length - 1) : f.name;
    if (stem && f.ext) {
      name.appendChild(highlight(stem, state.q));
      var ex = el('span', { class: 'ext-part' });
      ex.appendChild(highlight(f.name.slice(stem.length), state.q));
      name.appendChild(ex);
    } else {
      name.appendChild(highlight(f.name, state.q));
    }

    var meta = el('div', { class: 'c-meta' }, [
      el('span', { class: 'c-tag', text: cat.label.replace(' & Apps', '') })
    ]);
    meta.appendChild(el('i'));
    meta.appendChild(el('span', { text: f.size ? bytes(f.size) : 'unknown size' }));
    if (f.date) {
      meta.appendChild(el('i'));
      meta.appendChild(el('span', { class: 'hide-sm', text: rel(f.date) }));
    }

    var actions = el('div', { class: 'c-actions' }, [
      iconAction('Preview', svg('eye', 'ic'), function (e) { e.stopPropagation(); openPreview(f.id); }),
      iconAction('Download', svg('download', 'ic'), function (e) { e.stopPropagation(); download(f); })
    ]);

    var card = el('article', {
      class: 'card', 'data-id': f.id, tabindex: '0', role: 'button',
      style: { '--i': i, '--cat': cat.color },
      'aria-label': f.name + ' — ' + cat.label + (f.size ? ', ' + bytes(f.size) : '')
    }, [thumb, el('div', { class: 'card-body' }, [name, meta]), actions]);

    card.addEventListener('click', function () { openPreview(f.id); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPreview(f.id); }
      if (e.key.toLowerCase() === 'd') { e.preventDefault(); download(f); }
    });
    return card;
  }

  function iconAction(label, html, onClick) {
    var b = el('button', { type: 'button', title: label, 'aria-label': label, html: html });
    b.addEventListener('click', onClick);
    return b;
  }

  function emptyState() {
    var box = el('div', { class: 'empty' });
    if (state.q) {
      box.appendChild(el('span', { class: 'ring', html: svg('search', '') }));
      box.appendChild(el('h3', { text: 'No file matches “' + state.q + '”' }));
      box.appendChild(el('p', { text: 'Search looks at file names, types, tags, descriptions and folders — across every category at once.' }));
      var row = el('div', { class: 'empty-row' });
      CATEGORIES.forEach(function (c) {
        row.appendChild(el('button', {
          class: 'chip', type: 'button', text: 'Search ' + c.label + ' instead',
          onclick: function () { state.cat = c.id; state.q = ''; $('#search').value = ''; saveState(); render(); }
        }));
      });
      box.appendChild(row);
      box.appendChild(el('div', { class: 'empty-row' }, [
        el('button', { class: 'btn btn-quiet btn-sm', text: 'Clear search', onclick: function () { setQuery(''); } })
      ]));
    } else {
      box.appendChild(el('span', { class: 'ring', html: svg('upload', '') }));
      box.appendChild(el('h3', { text: catOf({ category: state.cat }).id === 'all' ? 'Your drive is ready' : CAT[state.cat].label + ' is empty' }));
      box.appendChild(el('p', {
        text: state.cat === 'all'
          ? 'Drop files anywhere on this page to keep them in this browser, or commit them to the repo under files/<category>/ and list them in js/manifest.js to publish them for good.'
          : 'Add a file to this category by dropping it here, or by committing it to files/' + state.cat + '/ and referencing it in js/manifest.js.'
      }));
      box.appendChild(el('div', { class: 'empty-row' }, [
        el('button', { class: 'btn btn-primary btn-sm', html: svg('upload', 'ic') + 'Upload files', onclick: function () { $('#file-input').click(); } }),
        el('button', { class: 'btn btn-quiet btn-sm', html: svg('folder', 'ic') + 'How publishing works', onclick: function () { $('#guide').hidden = false; } })
      ]));
    }
    return box;
  }

  function render() {
    state.byId = {};
    allFiles().forEach(function (f) { state.byId[f.id] = f; });
    renderNav();
    renderHero();

    var list = visibleFiles();
    if (starFilterOn) list = list.filter(function (f) { return f.starred; });
    if (state.q) {
      var scored = {};
      search(state.q, 500).forEach(function (x) { scored[x.f.id] = x.s; });
      list = list.filter(function (f) { return scored[f.id]; })
        .sort(function (a, b) { return scored[b.id] - scored[a.id]; });
    }

    var grid = $('#grid');
    grid.className = state.view === 'list' ? 'grid is-list' : 'grid';
    grid.innerHTML = '';
    if (!list.length) { grid.appendChild(emptyState()); return; }
    var frag = document.createDocumentFragment();
    list.forEach(function (f, i) { frag.appendChild(cardEl(f, i)); });
    grid.appendChild(frag);
  }

  /* ------------------------------------------------------------------ *
   * 8. Downloads
   * ------------------------------------------------------------------ */
  function triggerDownload(url, filename) {
    var a = el('a', { href: url, download: filename, rel: 'noopener' });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); }, 400);
  }

  function download(f) {
    if (f.source === 'local') {
      getBlobUrl(f).then(function (u) {
        triggerDownload(u, f.name);
        toast('Downloading ' + f.name, 'ok');
      }).catch(function (e) { toast(e.message, 'err'); });
      return;
    }
    fetch(f.url).then(function (r) {
      if (!r.ok) throw new Error('Server returned ' + r.status + ' for ' + f.name);
      return r.blob();
    }).then(function (b) {
      var u = URL.createObjectURL(b);
      objectURLs.push(u);
      triggerDownload(u, f.name);
      toast('Downloading ' + f.name + ' · ' + bytes(b.size), 'ok');
    }).catch(function () {
      // last resort: let the browser handle the raw link
      triggerDownload(f.url, f.name);
    });
  }

  /* ------------------------------------------------------------------ *
   * 9. Preview modal
   * ------------------------------------------------------------------ */
  var currentUrl = null;
  var currentFile = null;

  function openPreview(id) {
    var f = state.byId[id] || allFiles().filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    state.lastFocus = document.activeElement;
    currentFile = f;
    state.activeId = id;
    var modal = $('#modal');
    var viewer = $('#pv-viewer');
    var cat = catOf(f);

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.sheet', modal).style.setProperty('--cat', cat.color);
    viewer.innerHTML = '<div class="fallback"><span class="fb-ic">' + svg(cat.icon, '') + '</span><p>Loading “' + esc(f.name) + '”…</p></div>';
    viewer.className = 'viewer';
    $('#pv-name').textContent = f.name;
    $('#pv-name').title = f.name;
    $('#pv-badge').innerHTML = svg(cat.icon, 'svg') + '<span>' + cat.label.replace(' & Apps', '') + '</span>';
    $('#pv-badge').style.setProperty('--cat', cat.color);

    renderMeta(f);
    renderPreview(f, viewer);
    // the anchor keeps the true filename for save-as dialogs, and points at the
    // real file for repo items (blob URL for local ones) so it works without JS too
    var dl = $('#pv-download');
    dl.setAttribute('download', f.name);
    dl.href = f.source === 'local' ? '#' : f.url;
    dl.onclick = function (e) { e.preventDefault(); download(f); };
    $('#pv-copy-link').onclick = function () { copyLink(f); };
    $('#pv-open-tab').onclick = function () { getBlobUrl(f).then(function (u) { window.open(u, '_blank', 'noopener'); }); };
    $('#pv-delete').hidden = f.source !== 'local';
    $('#pv-delete').onclick = function () { removeLocal(f); };
    setTimeout(function () { $('.sheet .icon-btn').focus(); }, 30);
    if (history.replaceState) history.replaceState(null, '', '?f=' + encodeURIComponent(f.uid));
  }

  function closePreview() {
    var modal = $('#modal');
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    $('#pv-viewer').innerHTML = '';
    if (currentUrl) { try { URL.revokeObjectURL(currentUrl); } catch (e) {} currentUrl = null; }
    currentFile = null;
    state.activeId = null;
    if (history.replaceState) history.replaceState(null, '', location.pathname);
    if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
  }

  function renderMeta(f) {
    var rows = [
      ['Category', catOf(f).label],
      ['Type', (f.ext ? f.ext.toUpperCase() + ' file' : 'unknown type') + (f.blobType ? ' · ' + f.blobType : '')],
      ['Size', f.size ? bytes(f.size) + ' (' + f.size.toLocaleString() + ' bytes)' : 'measuring…'],
      ['Modified', f.date ? fmtDate(f.date) + (rel(f.date) ? ' · ' + rel(f.date) : '') : '—'],
      ['Location', f.source === 'local' ? 'This browser (IndexedDB)' : 'GitHub Pages repo'],
      ['Path', f.source === 'local' ? 'nendu-cloud://' + f.path : '<a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.path) + '</a>']
    ];
    var dl = $('#pv-meta');
    dl.innerHTML = '';
    rows.forEach(function (r) {
      dl.appendChild(el('dt', { text: r[0] }));
      dl.appendChild(el('dd', { html: String(r[1]).indexOf('<') === 0 ? r[1] : esc(r[1]) }));
    });
    var ex = $('#pv-extras');
    ex.innerHTML = '';
    if (f.description) ex.appendChild(el('p', { class: 'hint', text: f.description, style: { fontSize: '12.6px', color: 'var(--text-2)' } }));

    // integrity hash (uses the blob already held by the preview)
    var box = el('div', { class: 'hashbox' }, [el('b', { text: 'SHA-256 · computing' })]);
    ex.appendChild(box);
    getBlob(f).then(function (x) {
      return hashBlob(x.blob).then(function (h) {
        box.innerHTML = '';
        if (!h) { box.appendChild(el('b', { text: 'SHA-256 · unavailable in this browser' })); return; }
        if (h === 'too-big') { box.appendChild(el('b', { text: 'SHA-256 · skipped (file larger than ' + bytes(MAX_HASH) + ')' })); return; }
        box.appendChild(el('b', { text: 'SHA-256 · verify before installing' }));
        var val = el('span', { text: h, style: { color: 'var(--text-2)' } });
        box.appendChild(val);
        var cp = el('button', { class: 'btn btn-quiet btn-sm', text: 'Copy hash', style: { alignSelf: 'flex-start', marginTop: '4px' } });
        cp.addEventListener('click', function () { copyText(h).then(function () { toast('Hash copied', 'ok'); }); });
        box.appendChild(cp);
      });
    }).catch(function () { box.innerHTML = '<b>SHA-256 · file could not be read</b>'; });

    var tags = $('#pv-tags');
    tags.innerHTML = '';
    (f.tags || []).forEach(function (t) {
      tags.appendChild(el('button', {
        class: 'tag', type: 'button', text: '#' + t,
        onclick: function () { setQuery(t); }
      }));
    });
    if (!f.tags || !f.tags.length) tags.innerHTML = '<span class="hint">No tags. Repo files can carry tags in js/manifest.js.</span>';

    $('#pv-hint').textContent = f.source === 'local'
      ? 'This file lives only in this browser. Export the manifest to publish it into the repo, or download it to keep a copy.'
      : 'This file is served from the repository — anyone with your drive link can preview and download it.';
    $('.actions').classList.toggle('has-tab', f.source === 'local');
    $('#pv-open-tab').hidden = f.source !== 'local';
  }

  function renderPreview(f, viewer) {
    var cat = f.category;
    getBlobUrl(f).then(function (url) {
      currentUrl = url;
      viewer.innerHTML = '';
      if (cat === 'photos' || ['svg', 'gif', 'png', 'webp', 'jpg', 'jpeg', 'avif', 'bmp', 'ico'].indexOf(f.ext) >= 0) return renderImage(f, url, viewer);
      if (cat === 'videos') return renderVideo(f, url, viewer);
      if (cat === 'audio') return renderAudio(f, url, viewer);
      if (f.ext === 'pdf') return renderIframe(f, url, viewer, 'PDF preview');
      if (f.ext === 'epub') return renderFallback(f, viewer, 'epub');
      if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].indexOf(f.ext) >= 0) return renderOffice(f, url, viewer);
      if (TEXTY.indexOf(f.ext) >= 0 || (f.blobType || '').indexOf('text/') === 0) return renderText(f, url, viewer);
      if (cat === 'apk') return renderBinaryInfo(f, viewer, 'apk');
      if (cat === 'archives') return renderBinaryInfo(f, viewer, 'archive');
      return renderBinaryInfo(f, viewer, 'other');
    }).catch(function (err) {
      viewer.innerHTML = '';
      viewer.appendChild(el('div', { class: 'fallback' }, [
        el('span', { class: 'fb-ic', html: svg('cloud', '') }),
        el('h3', { text: 'Could not open this file' }),
        el('p', { text: err.message || String(err) }),
        el('div', { class: 'empty-row' }, [
          el('button', { class: 'btn btn-primary btn-sm', text: 'Try download instead', onclick: function () { download(f); } })
        ])
      ]));
    });
  }

  /* ---- images ---- */
  function renderImage(f, url, viewer) {
    viewer.classList.add('pad-0');
    var stage = el('div', { style: { display: 'grid', placeItems: 'center', width: '100%', height: '100%', padding: '18px', overflow: 'auto' } });
    var img = el('img', { src: url, alt: f.name, style: { cursor: 'zoom-in', transition: 'transform .2s' } });
    var zoom = 1, pixel = false;
    img.addEventListener('click', function () {
      zoom = zoom >= 3 ? 1 : zoom + 0.5;
      img.style.transform = 'scale(' + zoom + ')';
      img.style.cursor = zoom > 1 ? 'zoom-out' : 'zoom-in';
      if (f.ext === 'svg' || f.ext === 'ico' || f.ext === 'png') img.classList.toggle('pixel', zoom > 1.4);
    });
    stage.appendChild(img);
    viewer.appendChild(stage);

    var bar = el('div', { style: { position: 'absolute', left: '18px', bottom: '16px', display: 'flex', gap: '7px', alignItems: 'center',
      background: 'color-mix(in srgb,var(--bg) 72%,transparent)', border: '1px solid var(--line)', borderRadius: '99px', padding: '5px 8px', backdropFilter: 'blur(8px)' } });
    var dims = el('span', { style: { fontSize: '12px', color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums', padding: '0 4px' } });
    var im2 = new Image();
    im2.onload = function () { dims.textContent = im2.naturalWidth + ' × ' + im2.naturalHeight + ' px'; };
    im2.src = url;
    bar.appendChild(dims);
    bar.appendChild(zoomBtn('−', function () { zoom = Math.max(0.5, zoom - 0.5); img.style.transform = 'scale(' + zoom + ')'; }));
    bar.appendChild(zoomBtn('Fit', function () { zoom = 1; img.style.transform = ''; }));
    bar.appendChild(zoomBtn('+', function () { zoom = Math.min(6, zoom + 0.5); img.style.transform = 'scale(' + zoom + ')'; }));
    viewer.appendChild(bar);
  }
  function zoomBtn(label, fn) {
    var b = el('button', { class: 'btn btn-quiet btn-sm', type: 'button', text: label });
    b.addEventListener('click', fn);
    return b;
  }

  /* ---- video ---- */
  function renderVideo(f, url, viewer) {
    var v = el('video', { src: url, controls: true, playsinline: true, preload: 'metadata' });
    v.innerHTML = '<track kind="captions">';
    var wrap = el('div', { style: { width: '100%', height: '100%', display: 'grid', placeItems: 'center', gap: '10px' } }, [v]);
    viewer.appendChild(wrap);
    var ctl = el('div', { style: { position: 'absolute', right: '16px', top: '16px', display: 'flex', gap: '6px' } });
    ['0.5×', '1×', '1.5×', '2×'].forEach(function (s) {
      var b = el('button', { class: 'chip', type: 'button', text: s, 'aria-pressed': s === '1×' ? 'true' : 'false' });
      b.addEventListener('click', function () {
        v.playbackRate = parseFloat(s);
        $$('.chip', ctl).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      ctl.appendChild(b);
    });
    viewer.appendChild(ctl);
    v.addEventListener('error', function () {
      viewer.innerHTML = '';
      viewer.appendChild(el('div', { class: 'fallback' }, [
        el('span', { class: 'fb-ic', html: svg('videos', '') }),
        el('h3', { text: 'This video codec cannot play inline' }),
        el('p', { text: 'Browsers can preview H.264/VP9/AV1 in MP4, WebM or MOV. ' + (f.ext || 'This') + ' files with other codecs still download and play fine in a player.' }),
        el('div', { class: 'empty-row' }, [
          el('a', { class: 'btn btn-primary btn-sm', href: url, download: f.name, text: 'Download and open in a player' })
        ])
      ]));
    });
  }

  /* ---- audio ---- */
  function renderAudio(f, url, viewer) {
    var stage = el('div', { class: 'audio-stage', style: { '--cat': catOf(f).color } });
    stage.appendChild(el('div', { class: 'disc', html: svg('audio', '') }));
    stage.appendChild(el('div', { style: { textAlign: 'center' } }, [
      el('div', { style: { fontWeight: '700', fontSize: '15px' }, text: baseOf(f.name) }),
      el('div', { class: 'muted', style: { fontSize: '12px' }, text: (f.ext || 'audio').toUpperCase() + ' · ' + (f.size ? bytes(f.size) : 'size unknown') })
    ]));
    var bars = el('div', { class: 'wavestrip', 'aria-hidden': 'true' });
    for (var i = 0; i < 56; i++) {
      bars.appendChild(el('i', { style: { height: (18 + Math.abs(Math.sin(i * 1.7)) * 78 + (i % 5) * 4) + '%', opacity: 0.35 + (i % 7) / 12 } }));
    }
    stage.appendChild(bars);
    var a = el('audio', { src: url, controls: true, preload: 'metadata' });
    stage.appendChild(a);
    viewer.appendChild(stage);
  }

  /* ---- pdf / html iframe ---- */
  function renderIframe(f, url, viewer) {
    viewer.classList.add('pad-0');
    var fr = el('iframe', { src: url, title: f.name });
    viewer.appendChild(fr);
    var note = el('div', { class: 'warn', style: { position: 'absolute', right: '16px', bottom: '16px', maxWidth: '320px', background: 'color-mix(in srgb,var(--bg) 78%,transparent)', backdropFilter: 'blur(6px)' } });
    note.innerHTML = svg('sparkle', 'ic') + '<span>If your browser blocks the inline viewer, use <b>Open in tab</b> or Download.</span>';
    viewer.appendChild(note);
  }

  /* ---- office docs ---- */
  function renderOffice(f, url, viewer) {
    viewer.innerHTML = '';
    var box = el('div', { class: 'fallback' });
    box.appendChild(el('span', { class: 'fb-ic', html: svg('docs', '') }));
    box.appendChild(el('h3', { text: (f.ext || '').toUpperCase() + ' document' }));
    box.appendChild(el('p', { text: 'Word, Excel and PowerPoint previews are rendered through Microsoft Office’s online viewer when the file is reachable from the internet. Downloads always keep the original formatting.' }));
    var row = el('div', { class: 'empty-row' });
    var absolute = new URL(f.url || url, location.href).href;
    if (f.source === 'repo') {
      row.appendChild(el('a', {
        class: 'btn btn-primary btn-sm', target: '_blank', rel: 'noopener',
        href: 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(absolute),
        text: 'Open in Office viewer'
      }));
    }
    row.appendChild(el('button', { class: 'btn btn-quiet btn-sm', text: 'Download instead', onclick: function () { download(f); } }));
    box.appendChild(row);
    if (f.source === 'local') {
      box.appendChild(el('div', { class: 'warn', html: svg('sparkle', 'ic') + '<span>Files stored only in your browser cannot be sent to an online viewer. Commit them to the repo to get a shareable preview link.</span>' }));
    }
    viewer.appendChild(box);
  }

  /* ---- text, code, markdown ---- */
  function renderText(f, url, viewer) {
    viewer.innerHTML = '';
    var wrap = el('div', { class: 'text-wrap' });
    var head = el('div', { class: 'text-head' });
    var stat = el('span', { text: 'reading…' });
    head.appendChild(stat);
    head.appendChild(el('span', { class: 'spacer' }));
    var modes = el('div', { style: { display: 'flex', gap: '6px' } });
    var isMd = f.ext === 'md' || f.ext === 'markdown';
    var mode = isMd ? 'rendered' : 'raw';
    var pre = el('pre', { class: 'code' });
    var mdBox = el('div', { class: 'md' });
    var toggleBtn;
    if (isMd) {
      toggleBtn = el('button', { class: 'chip', type: 'button', text: 'Show raw' });
      toggleBtn.addEventListener('click', function () {
        mode = mode === 'raw' ? 'rendered' : 'raw';
        toggleBtn.textContent = mode === 'raw' ? 'Show rendered' : 'Show raw';
        pre.hidden = mode !== 'raw';
        mdBox.hidden = mode !== 'rendered';
      });
      modes.appendChild(toggleBtn);
    }
    var wrapBtn = el('button', { class: 'chip', type: 'button', text: 'Wrap: on', 'aria-pressed': 'true' });
    wrapBtn.addEventListener('click', function () {
      var on = pre.classList.toggle('wrap-lines');
      wrapBtn.textContent = on ? 'Wrap: on' : 'Wrap: off';
      wrapBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    modes.appendChild(wrapBtn);
    modes.appendChild(el('button', {
      class: 'chip', type: 'button', text: 'Copy text',
      onclick: function (e) {
        copyText(f.__text || '').then(function () { toast('Text copied', 'ok'); });
        e.target.textContent = 'Copied ✓';
        setTimeout(function () { if (e.target) e.target.textContent = 'Copy text'; }, 1400);
      }
    }));
    head.appendChild(modes);
    wrap.appendChild(head);

    fetch(url).then(function (r) { return r.text(); }).then(function (text) {
      var lines = text.split('\n');
      if (text.length > MAX_INLINE_TEXT) text = text.slice(0, MAX_INLINE_TEXT);
      f.__text = text;
      stat.textContent = lines.length.toLocaleString() + ' lines · ' + bytes(text.length) + ' · ' + (f.ext || 'txt').toUpperCase();
      if (isMd) {
        mdBox.innerHTML = markdown(text);
        mdBox.hidden = false;
        pre.hidden = true;
      }
      var html = CODEY.indexOf(f.ext) >= 0 ? highlightCode(text, f.ext) : esc(text);
      pre.innerHTML = html.split('\n').map(function (l) { return '<span class="ln">' + (l || ' ') + '</span>'; }).join('');
      pre.classList.add('wrap-lines');
      wrap.appendChild(pre);
      if (isMd) {
        wrap.insertBefore(mdBox, pre);
        $$('a', mdBox).forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
      }
    }).catch(function (e) {
      stat.textContent = 'could not read file: ' + e.message;
    });
    viewer.appendChild(wrap);
  }

  var KEYWORDS = /\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|this|typeof|instanceof|await|async|yield|try|catch|finally|throw|import|export|from|default|void|delete|null|undefined|true|false|def|elif|lambda|self|print|pass|elif|None|True|False|end|then|elsif|unless|module|require|package|func|type|struct|interface|public|private|protected|static|final|const|var|use|fn|impl|match|in|of|not|and|or|is|echo|die|elseif|endif|foreach)\b/g;

  function highlightCode(text, ext) {
    var out = esc(text);
    // comments
    out = out.replace(/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;|&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;)/g, function (m) { return '<i class="tok-com">' + m + '</i>'; });
    // strings
    out = out.replace(/((?:&quot;|&#39;|")[^"&'\n]*(?:&quot;|&#39;|"))/g, function (m) {
      return m.indexOf('tok-com') >= 0 ? m : '<i class="tok-str">' + m + '</i>';
    });
    // tags
    out = out.replace(/(&lt;\/?)([a-zA-Z][\w:-]*)/g, function (m, a, b) { return a + '<i class="tok-tag">' + b + '</i>'; });
    // numbers
    out = out.replace(/\b(0x[\da-f]+|\d+(?:\.\d+)?)\b/gi, function (m) { return '<i class="tok-num">' + m + '</i>'; });
    // keywords (avoid matching inside already-tagged spans)
    out = out.replace(/(^|>)([^<]*)/g, function (m, pre2, body) {
      return pre2 + body.replace(KEYWORDS, '<i class="tok-key">$1</i>')
        .replace(/([a-zA-Z_][\w]*)(?=\s*:)/g, '<i class="tok-prop">$1</i>');
    });
    return out.replace(/<i class="tok-([a-z]+)">(.*?)<\/i>/g, '<span class="tok-$1">$2</span>');
  }

  function markdown(src) {
    var html = esc(src)
      .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
      .replace(/^\s*>\s?(.*)$/gm, '<blockquote>$1</blockquote>')
      .replace(/```([\s\S]*?)```/g, function (m, c) { return '<pre><code>' + c.replace(/^\n/, '') + '</code></pre>'; })
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>')
      .replace(/^\|\s*(.+)\s*\|$/gm, function (m, row) {
        if (/^[\s|:-]+$/.test(row)) return '';
        var cells = row.split('|').map(function (c) { return c.trim(); });
        return '<tr>' + cells.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      })
      .replace(/(<tr>[\s\S]*?<\/tr>)(?!\s*<tr>)/g, '<table>$1</table>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');
    return '<p>' + html + '</p>'.replace(/<\/p>\s*<(h1|h2|h3|ul|table|pre|blockquote)/, '<$1');
  }

  /* ---- binary / apk / archive ---- */
  function renderBinaryInfo(f, viewer, kind) {
    viewer.innerHTML = '';
    var box = el('div', { class: 'fallback' });
    box.appendChild(el('span', { class: 'fb-ic', html: svg(kind === 'apk' ? 'apk' : kind === 'archive' ? 'zip' : 'file', '') }));
    box.appendChild(el('h3', { text: kind === 'apk' ? 'Android package ready to sideload' : kind === 'archive' ? 'Compressed container' : 'Binary file' }));
    box.appendChild(el('p', {
      text: kind === 'apk'
        ? 'Browsers cannot install APKs directly — download the package and open it on your phone. The SHA-256 in this panel lets you verify the file matches what was published.'
        : kind === 'archive'
          ? 'Archives are previewed as a listing of their first entries when possible; the full contents come with the download.'
          : 'This file type has no inline viewer. It is stored untouched and downloads byte-for-byte.'
    }));
    var row = el('div', { class: 'empty-row' }, [
      el('button', { class: 'btn btn-primary btn-sm', html: svg('download', 'ic') + 'Download ' + (f.ext || '').toUpperCase(), onclick: function () { download(f); } })
    ]);
    if (kind === 'apk') {
      row.appendChild(el('button', { class: 'btn btn-quiet btn-sm', html: svg('copy', 'ic') + 'Copy install link', onclick: function () { copyLink(f); } }));
    }
    box.appendChild(row);
    var peek = el('div', { style: { width: '100%', marginTop: '14px', maxHeight: '240px', overflow: 'auto', textAlign: 'left' } });
    box.appendChild(peek);
    viewer.appendChild(box);
    bytePeek(f, kind, peek);
  }

  function bytePeek(f, kind, target) {
    target.innerHTML = '<p class="hint">Reading file header…</p>';
    getBlob(f).then(function (x) { return x.blob; }).then(function (b) {
      return b.slice(0, MAX_HEX).arrayBuffer().then(function (buf) {
        var u8 = new Uint8Array(buf);
        var lines = [];
        for (var off = 0; off < u8.length; off += 16) {
          var hex = [], ascii = [];
          for (var i = 0; i < 16; i++) {
            var c = u8[off + i];
            if (c === undefined) { hex.push('  '); ascii.push(' '); continue; }
            hex.push(c.toString(16).padStart(2, '0'));
            ascii.push(c >= 32 && c < 127 ? String.fromCharCode(c) : '.');
          }
          lines.push('<span>' + off.toString(16).padStart(8, '0') + '</span>  <b>' + hex.join(' ') + '</b>  <em>' + esc(ascii.join('')) + '</em>');
        }
        // build the whole panel detached, then swap it in once
        var panel = el('div');
        var head = el('div', { class: 'text-head', style: { position: 'static' } });
        var shown = Math.min(b.size, MAX_HEX);
        head.appendChild(el('span', { text: b.size > shown ? ('first ' + bytes(shown) + ' of ' + bytes(b.size) + ' · header dump') : ('whole file · ' + bytes(b.size) + ' · header dump') }));
        var sp = el('span', { style: { flex: '1' } }); head.appendChild(sp);
        if (b.size > shown) head.appendChild(el('button', {
          class: 'chip', type: 'button', text: 'Open whole file',
          onclick: function () { getBlobUrl(f).then(function (u) { window.open(u, '_blank', 'noopener'); }); }
        }));
        panel.appendChild(head);
        var pre = el('pre', { class: 'hex' });
        pre.innerHTML = lines.join('\n');
        panel.appendChild(pre);
        if (looksZip(u8)) panel.appendChild(zipListing(b));
        target.innerHTML = '';
        target.appendChild(panel);
      });
    }).catch(function () {
      target.innerHTML = '<p class="hint">Header could not be read from this origin.</p>';
    });
  }

  function looksZip(u8) {
    return u8.length > 4 && u8[0] === 0x50 && u8[1] === 0x4b && (u8[2] === 3 || u8[2] === 5);
  }

  /**
   * Reads a .zip central directory straight from the last 64 KB of the file,
   * so archives get a real "contents of this zip" list without downloading
   * (or decompressing) the whole thing.
   */
  function zipListing(blob) {
    var box = el('div', { class: 'zipbox' });
    box.appendChild(el('div', { class: 'text-head' }, [el('span', { text: 'measuring archive…' })]));
    var size = blob.size;
    var tail = blob.slice(Math.max(0, size - 65557));
    tail.arrayBuffer().then(function (buf) {
      var u8 = new Uint8Array(buf);
      var dv = new DataView(buf);
      var tailStart = Math.max(0, size - 65557);
      var eocd = -1, i;
      var lo = Math.max(0, u8.length - 22 - 65535);
      for (i = u8.length - 22; i >= lo; i -= 1) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
      }
      if (eocd < 0) {
        box.innerHTML = '<div class="warn">' + svg('zip', 'ic') + '<span>This is a ZIP-family file, but its index sits beyond the readable tail — extract it locally to list entries.</span></div>';
        return;
      }
      var count = dv.getUint16(eocd + 10, true);
      var cdOff = dv.getUint32(eocd + 16, true);
      var at = cdOff - tailStart;
      var rows = [], total = 0, names = {};
      var cap = Math.min(count, 400);
      for (i = 0; i < count; i++) {
        if (at + 46 > u8.length || dv.getUint32(at, true) !== 0x02014b50) break;
        var method = dv.getUint16(at + 10, true);
        var csize = dv.getUint32(at + 20, true);
        var usize = dv.getUint32(at + 24, true);
        var nlen = dv.getUint16(at + 28, true);
        var elen = dv.getUint16(at + 30, true);
        var clen = dv.getUint16(at + 32, true);
        var nameEnd = at + 46 + nlen;
        if (nameEnd > u8.length) break;
        var name = new TextDecoder().decode(u8.subarray(at + 46, nameEnd));
        var dir = /\/$/.test(name);
        total += usize;
        if (!dir) { names[name.split('/').shift()] = 1; }
        rows.push({ name: name, size: usize, packed: csize, dir: dir, method: method, off: dv.getUint32(at + 42, true) });
        at = nameEnd + elen + clen;
      }
      box.innerHTML = '';
      var head = el('div', { class: 'text-head' }, [
        el('span', { text: cap < count ? ('showing ' + cap + ' of ' + count.toLocaleString() + ' entries') : (count.toLocaleString() + ' entr' + (count === 1 ? 'y' : 'ies')) }),
        el('span', { class: 'spacer' }),
        el('span', { text: bytes(total) + ' unpacked' })
      ]);
      box.appendChild(head);
      var ul = el('ul', { class: 'zip-list' });
      rows.slice(0, cap).forEach(function (r) {
        var li = el('li', {}, [
          el('span', { style: { color: 'var(--muted)' }, html: svg(r.dir ? 'folder' : 'file', 'ic') }),
          el('span', { style: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, text: r.name }),
          el('span', { class: 'sz', text: r.dir ? '' : bytes(r.size) })
        ]);
        ul.appendChild(li);
      });
      box.appendChild(ul);
      if (count > cap) box.appendChild(el('p', { class: 'hint', text: 'Download the archive to see all ' + count.toLocaleString() + ' entries.' }));
    }).catch(function () {
      box.innerHTML = '<div class="warn">' + svg('zip', 'ic') + '<span>Archive index could not be read from this origin.</span></div>';
    });
    return box;
  }

  function renderFallback(f, viewer, reason) {
    viewer.innerHTML = '';
    var box = el('div', { class: 'fallback' });
    box.appendChild(el('span', { class: 'fb-ic', html: svg(catOf(f).icon, '') }));
    box.appendChild(el('h3', { text: 'No inline viewer for ' + (f.ext || 'this').toUpperCase() }));
    box.appendChild(el('p', { text: 'The file is stored intact and downloads in one click. Reason: ' + reason + '.' }));
    box.appendChild(el('div', { class: 'empty-row' }, [
      el('button', { class: 'btn btn-primary btn-sm', text: 'Download', onclick: function () { download(f); } })
    ]));
    viewer.appendChild(box);
  }

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (resolve) {
      var ta = el('textarea', { style: { position: 'fixed', opacity: '0' } });
      ta.value = t;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
      resolve();
    });
  }

  function copyLink(f) {
    var link = location.origin + location.pathname + '?f=' + encodeURIComponent(f.uid);
    copyText(link).then(function () { toast('Direct link copied — it opens this preview', 'ok'); });
  }

  /* ------------------------------------------------------------------ *
   * 10. Uploads
   * ------------------------------------------------------------------ */
  var queueItems = {};

  function handleFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    var queue = $('#queue');
    queue.hidden = false;
    $('#queue-list').innerHTML = '';
    queueItems = {};
    var done = 0;
    $('#queue-progress').textContent = '0 / ' + files.length;

    files.forEach(function (file, idx) {
      var li = el('li', {}, [el('span', { class: 'q-name', text: file.name }), el('span', { class: 'q-bar' }, [el('i')])]);
      $('#queue-list').appendChild(li);
      var bar = $('.q-bar i', li);

      if (file.size > MAX_UPLOAD) {
        li.insertBefore(el('span', { class: 'q-ic q-err', html: svg('x', 'ic') }), li.firstChild);
        toast(file.name + ' is larger than ' + bytes(MAX_UPLOAD) + ' — commit it to the repo instead', 'err');
        finish();
        return;
      }

      var id = 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      var ext = extOf(file.name);
      var record = {
        id: id,
        name: file.name,
        ext: ext,
        category: EXT2CAT[ext] || guessCategory(file.type, ext),
        path: 'local/' + (EXT2CAT[ext] || guessCategory(file.type, ext)) + '/' + file.name,
        size: file.size,
        blobType: file.type || '',
        date: new Date(file.lastModified || Date.now()).toISOString(),
        updatedAt: Date.now(),
        tags: ['uploaded'],
        description: 'Added from this device.'
      };

      bar.style.width = '35%';
      NenduStore.put(record, file).then(function () {
        bar.style.width = '100%';
        li.insertBefore(el('span', { class: 'q-ic q-ok', html: svg('check', 'ic') }), li.firstChild);
        return thumbnailFor(record, file);
      }).then(function (thumb) {
        if (thumb) {
          record.thumb = thumb;
          return NenduStore.put(record, file);
        }
      }).then(function () {
        return loadLocal();
      }).then(function () {
        finish();
        render();
        renderQuota();
      }).catch(function (err) {
        li.insertBefore(el('span', { class: 'q-ic q-err', html: svg('x', 'ic') }), li.firstChild);
        $('.q-name', li).textContent = file.name + ' — ' + (err.message || 'failed');
        finish();
      });
    });

    function finish() {
      done++;
      $('#queue-progress').textContent = done + ' / ' + files.length;
      if (done >= files.length) {
        if (finish.t) clearTimeout(finish.t);
        finish.t = setTimeout(function () { $('#queue').hidden = true; }, 2400);
        toast(files.length === 1 ? '1 file added to your drive' : files.length + ' files added to your drive', 'ok');
      }
    }
  }

  function guessCategory(mime, ext) {
    if (!mime) return 'other';
    if (mime.indexOf('image/') === 0) return 'photos';
    if (mime.indexOf('video/') === 0) return 'videos';
    if (mime.indexOf('audio/') === 0) return 'audio';
    if (mime === 'application/vnd.android.package-archive') return 'apk';
    if (/pdf|word|excel|powerpoint|officedocument|text\/plain|epub/.test(mime)) return 'docs';
    if (/zip|rar|7z|tar|gz|iso|x-archive/.test(mime)) return 'archives';
    return 'other';
  }

  function thumbnailFor(record, file) {
    var url = URL.createObjectURL(file);
    var cleanup = function () { URL.revokeObjectURL(url); };
    if (/^image\//.test(file.type) && ['gif', 'svg', 'ico'].indexOf(record.ext) < 0) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          try {
            var max = 560, scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
            var c = el('canvas');
            c.width = Math.max(1, Math.round(img.naturalWidth * scale));
            c.height = Math.max(1, Math.round(img.naturalHeight * scale));
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            var out = c.toDataURL('image/jpeg', 0.8);
            cleanup();
            resolve(out.length < 190000 ? out : '');
          } catch (e) { cleanup(); resolve(''); }
        };
        img.onerror = function () { cleanup(); resolve(''); };
        img.src = url;
      });
    }
    if (/^video\//.test(file.type)) {
      return new Promise(function (resolve) {
        var v = el('video', { muted: true, preload: 'metadata', src: url });
        var fail = function () { cleanup(); resolve(''); };
        v.addEventListener('loadeddata', function () {
          try { v.currentTime = Math.min(0.4, (v.duration || 1) / 3); } catch (e) { return fail(); }
        });
        v.addEventListener('seeked', function () {
          try {
            var w = v.videoWidth || 640, h = v.videoHeight || 360;
            var scale = Math.min(1, 560 / Math.max(w, h));
            var c = el('canvas');
            c.width = Math.round(w * scale); c.height = Math.round(h * scale);
            c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
            var out = c.toDataURL('image/jpeg', 0.75);
            cleanup();
            resolve(out.length < 190000 ? out : '');
          } catch (e) { fail(); }
        });
        v.onerror = fail;
        setTimeout(fail, 4000);
      });
    }
    cleanup();
    return Promise.resolve('');
  }

  /** In-panel confirmation instead of window.confirm() — nothing blocks the page. */
  function removeLocal(f) {
    var viewer = $('#pv-viewer');
    var ask = el('div', { class: 'confirmbox' }, [
      el('div', { html: svg('trash', 'ic') }),
      el('div', { class: 'cb-copy' }, [
        el('strong', { text: 'Remove “' + f.name + '” from this browser?' }),
        el('span', { class: 'muted', text: 'Only the copy stored in this browser is deleted — a published repo file is never touched, and you can re-add it any time.' })
      ]),
      el('div', { class: 'cb-actions' }, [
        el('button', { class: 'btn btn-quiet btn-sm', type: 'button', text: 'Keep it', onclick: close }),
        el('button', { class: 'btn btn-danger btn-sm', type: 'button', text: 'Remove for real', onclick: proceed })
      ])
    ]);
    function close() { ask.remove(); }
    function proceed() {
      NenduStore.remove(f.uid).then(function () {
        return loadLocal();
      }).then(function () {
        closePreview();
        render();
        renderQuota();
        toast('Removed from this browser', 'ok');
      }).catch(function (e) {
        ask.remove();
        toast(e.message || 'Could not remove the file', 'err');
      });
    }
    viewer.querySelectorAll('.confirmbox').forEach(function (n) { n.remove(); });
    viewer.appendChild(ask);
    ask.animate && ask.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
    $('.cb-actions .btn-danger', ask).focus();
  }

  /* ------------------------------------------------------------------ *
   * 11. Quota + manifest export
   * ------------------------------------------------------------------ */
  function renderQuota() {
    var repo = state.repoFiles.reduce(function (a, f) { return a + (f.size || 0); }, 0);
    if (!NenduStore.available()) {
      $('#quota-label').textContent = 'offline mode';
      $('#quota-fill').style.width = '0%';
      $('#quota-note').textContent = 'This browser blocks IndexedDB, so uploads are session-only. Repo files still work.';
      return;
    }
    NenduStore.usage().then(function (est) {
      var used = est.usage || 0;
      var quota = est.quota || 0;
      var files = state.localFiles.length;
      $('#quota-label').textContent = bytes(used) + ' / ' + (quota ? bytes(quota) : '—');
      $('#quota-fill').style.width = quota ? Math.min(100, Math.max(2, (used / quota) * 100)).toFixed(1) + '%' : '2%';
      $('#quota-note').innerHTML = files
        ? '<b>' + files + '</b> file' + (files > 1 ? 's' : '') + ' saved in this browser · repo library ' + bytes(repo)
        : 'No local files yet · repo library ' + (repo ? bytes(repo) : 'empty');
    });
  }

  function exportManifest() {
    var rows = state.localFiles.map(function (f) {
      return {
        id: f.uid.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
        name: f.name,
        category: f.category,
        path: 'files/' + f.category + '/' + f.name,
        size: f.size,
        modified: (f.date || '').slice(0, 10),
        tags: f.tags || [],
        description: f.description || ''
      };
    });
    var merged = (window.CLOUD_MANIFEST || []).slice();
    rows.forEach(function (r) {
      if (!merged.some(function (m) { return m.path === r.path; })) merged.push(r);
    });
    var body = '/* Nendu Cloud manifest · generated ' + new Date().toISOString() + '\n   Commit the files listed under path: to the repo, then replace js/manifest.js with this file. */\nwindow.CLOUD_MANIFEST = ' + JSON.stringify(merged, null, 2) + ';\n';
    var blob = new Blob([body], { type: 'text/javascript' });
    var u = URL.createObjectURL(blob);
    objectURLs.push(u);
    triggerDownload(u, 'manifest.js');
    toast(merged.length
      ? 'manifest.js exported with ' + merged.length + ' entries — drop it in js/ and commit your files'
      : 'Nothing to export yet — upload or add files first', 'ok');
  }

  /* ------------------------------------------------------------------ *
   * 12. Search UI
   * ------------------------------------------------------------------ */
  var suggestTimer = null;

  function setQuery(q) {
    state.q = q || '';
    $('#search').value = state.q;
    $('.search-wrap').classList.toggle('has-value', !!state.q);
    $('#btn-clear-search').hidden = !state.q;
    render();
    renderSuggest();
  }

  function renderSuggest() {
    var box = $('#suggest');
    if (!state.q || state.q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    var hits = search(state.q, 7);
    if (!hits.length) {
      box.hidden = false;
      box.innerHTML = '<div class="suggest-head">No matches</div>';
      box.appendChild(el('div', { class: 'sg-item', style: { cursor: 'default' } }, [
        el('span', { class: 'muted', text: 'Nothing named “' + state.q + '” yet. Try a type (apk, pdf, mp4) or a category name.' })
      ]));
      return;
    }
    box.hidden = false;
    box.innerHTML = '<div class="suggest-head">' + hits.length + (hits.length >= 7 ? '+' : '') + ' match' + (hits.length > 1 ? 'es' : '') + ' across all folders</div>';
    hits.forEach(function (h, i) {
      var f = h.f;
      var cat = catOf(f);
      var row = el('button', { class: 'sg-item', type: 'button', style: { '--cat': cat.color } });
      var tile = el('span', { class: 'mini-tile', html: svg(cat.icon, 'ic') });
      if (f.thumb) tile.innerHTML = '<img src="' + esc(f.thumb) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px">';
      var name = el('span', { class: 'sg-name' });
      name.appendChild(highlight(f.name, state.q));
      row.appendChild(tile);
      row.appendChild(name);
      row.appendChild(el('span', { class: 'sg-meta', text: cat.label + ' · ' + (f.size ? bytes(f.size) : '—') }));
      row.addEventListener('click', function () { box.hidden = true; openPreview(f.id); });
      box.appendChild(row);
    });
  }

  /* ------------------------------------------------------------------ *
   * 13. Wiring
   * ------------------------------------------------------------------ */
  function setCat(id) {
    state.cat = CAT[id] ? id : 'all';
    state.type = '';
    saveState();
    render();
    $('#sidebar').classList.remove('is-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ cat: state.cat, sort: state.sort, view: state.view, theme: state.theme }));
    } catch (e) {}
  }
  function restoreState() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (s.cat && (CAT[s.cat] || s.cat === 'all')) state.cat = s.cat;
      if (s.sort) state.sort = s.sort;
      if (s.view) state.view = s.view;
      if (s.theme) state.theme = s.theme;
    } catch (e) {}
    document.documentElement.dataset.theme = state.theme;
    $('#sort').value = state.sort;
    $$('.seg').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === state.view ? 'true' : 'false'); });
    syncThemeBtn();
  }
  function syncThemeBtn() {
    var b = $('#btn-theme');
    if (b) b.innerHTML = svg(state.theme === 'dark' ? 'sun' : 'moon', 'ic');
  }

  function bind() {
    $('#year').textContent = String(new Date().getFullYear());

    $('#btn-upload').addEventListener('click', function () { $('#file-input').click(); });
    $('#file-input').addEventListener('change', function (e) { handleFiles(e.target.files); e.target.value = ''; });
    $('#btn-add').addEventListener('click', function () { $('#guide').hidden = false; });
    $$('[data-close-guide]').forEach(function (n) { n.addEventListener('click', function () { $('#guide').hidden = true; }); });
    $('#btn-export').addEventListener('click', exportManifest);
    $('#queue-close').addEventListener('click', function () { $('#queue').hidden = true; });

    var input = $('#search');
    input.addEventListener('input', function () {
      state.q = input.value;
      $('.search-wrap').classList.toggle('has-value', !!state.q);
      $('#btn-clear-search').hidden = !state.q;
      clearTimeout(suggestTimer);
      suggestTimer = setTimeout(function () { render(); renderSuggest(); }, 90);
    });
    input.addEventListener('focus', renderSuggest);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = search(state.q, 1)[0];
        if (first) { $('#suggest').hidden = true; openPreview(first.f.id); }
      }
      if (e.key === 'Escape') { input.blur(); $('#suggest').hidden = true; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var items = $$('#suggest .sg-item');
        if (items.length) { items[0].focus(); items[0].classList.add('is-active'); }
      }
    });
    document.addEventListener('click', function (e) {
      if (!$('#suggest').hidden && !e.target.closest('.search-wrap')) $('#suggest').hidden = true;
    });
    $('#btn-clear-search').addEventListener('click', function () { setQuery(''); $('#search').focus(); });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; saveState(); render(); });
    $$('.seg').forEach(function (b) {
      b.addEventListener('click', function () {
        state.view = b.dataset.view;
        $$('.seg').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        saveState(); render();
      });
    });

    var tb = el('button', { class: 'icon-btn', id: 'btn-theme', type: 'button', 'aria-label': 'Switch colour theme' });
    tb.addEventListener('click', function () {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = state.theme;
      var m = document.querySelector('meta[name=theme-color]');
      if (m) m.setAttribute('content', state.theme === 'dark' ? '#0a0d13' : '#f3f6fb');
      saveState(); syncThemeBtn();
    });
    $('.tools').appendChild(tb);
    syncThemeBtn();

    $('#btn-menu').addEventListener('click', function () { $('#sidebar').classList.toggle('is-open'); });

    // one close path for every modal: backdrop click + [data-close] controls
    $$('.modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        var isSelf = e.target === modal || !!e.target.closest('[data-close]') || !!e.target.closest('[data-close-guide]');
        if (!isSelf) return;
        if (modal.id === 'modal') closePreview();
        else modal.hidden = true;
      });
    });

    // drag & drop
    var depth = 0;
    window.addEventListener('dragenter', function (e) {
      if (!e.dataTransfer || Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') < 0) return;
      depth++; $('#dropzone').hidden = false;
    });
    window.addEventListener('dragover', function (e) {
      if (e.dataTransfer) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }
    });
    window.addEventListener('dragleave', function () {
      depth = Math.max(0, depth - 1);
      if (!depth) $('#dropzone').hidden = true;
    });
    window.addEventListener('drop', function (e) {
      e.preventDefault();
      depth = 0; $('#dropzone').hidden = true;
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    });
    window.addEventListener('paste', function (e) {
      var files = e.clipboardData && e.clipboardData.files;
      if (files && files.length) handleFiles(files);
    });

    // keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (e.key === '/' && !typing) { e.preventDefault(); $('#search').focus(); $('#search').select(); return; }
      if (e.key === 'Escape') {
        if (!$('#modal').hidden) {
          var ask = $('#pv-viewer .confirmbox');
          if (ask) { ask.remove(); return; }
          closePreview(); return;
        }
        if (!$('#guide').hidden) { $('#guide').hidden = true; return; }
        if ($('#queue') && !$('#queue').hidden) { $('#queue').hidden = true; return; }
        if (state.q) setQuery('');
        // an empty Escape while the grid is focused closes a stuck viewer
        if ($('#modal').querySelector('.viewer').children.length) closePreview();
        return;
      }
      if (typing) return;
      if (e.key === 'g') { state.pendingNav = true; setTimeout(function () { state.pendingNav = false; }, 900); return; }
      if (state.pendingNav && /^[0-8]$/.test(e.key)) {
        var list = [CAT.all].concat(CATEGORIES);
        var pick = list[Number(e.key)];
        if (pick) setCat(pick.id);
        state.pendingNav = false;
        return;
      }
      if ((e.key === 'u' || (e.key === 'i' && (e.metaKey || e.ctrlKey))) && !e.metaKey) { e.preventDefault(); $('#file-input').click(); }
      if (e.key.toLowerCase() === 'p' && state.activeId) {
        var f = state.byId[state.activeId];
        var v = $('#pv-viewer video, #pv-viewer audio');
        if (v) { if (v.paused) v.play(); else v.pause(); }
      }
      if (e.key.toLowerCase() === 'd' && state.activeId) { download(state.byId[state.activeId]); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) $('#sidebar').classList.remove('is-open');
    });
  }

  /* ---- toasts ---- */
  function toast(msg, kind) {
    var t = el('div', { class: 'toast' + (kind ? ' ' + kind : ''), html: svg(kind === 'err' ? 'x' : kind === 'ok' ? 'check' : 'sparkle', 'ic') });
    t.appendChild(el('span', { text: msg }));
    $('#toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 260); }, 3200);
  }

  /* ---- boot ---- */
  function boot() {
    restoreState();
    loadRepo();
    bind();
    render();
    renderQuota();

    var start = function () {
      loadLocal().then(function () {
        render();
        renderQuota();
        // deep link ?f=<uid> opens a file straight away (share links)
        var p = new URLSearchParams(location.search).get('f');
        if (p) {
          var f = allFiles().filter(function (x) { return x.uid === p; })[0];
          if (f) openPreview(f.id);
        }
      });
    };
    if (typeof NenduStore === 'undefined') { setTimeout(start, 300); } else start();

    // refresh sizes once repo files exist
    if (!state.repoFiles.length) {
      $('#quota-note').innerHTML = 'Repo library is empty — drop files here, or publish them with <code>files/&lt;category&gt;/</code> + <code>js/manifest.js</code>.';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
