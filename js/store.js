/* =========================================================
   Nendu Cloud · js/store.js
   Thin promise wrapper over IndexedDB so the browser itself
   acts as the "cloud node" for files you drop on the page.
   Everything runs locally — no third-party server.
   ========================================================= */
(function (global) {
  'use strict';

  var DB_NAME = 'nendu-cloud';
  var DB_VERSION = 1;
  var BLOBS = 'blobs';   // key -> { id, blob }
  var META = 'meta';     // key -> file record (without blob)
  var dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      if (!('indexedDB' in global)) return reject(new Error('IndexedDB unavailable'));
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { return reject(e); }

      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(BLOBS)) db.createObjectStore(BLOBS);
        if (!db.objectStoreNames.contains(META)) {
          var s = db.createObjectStore(META, { keyPath: 'id' });
          s.createIndex('updatedAt', 'updatedAt');
        }
      };
      req.onsuccess = function () {
        var db = req.result;
        db.onversionchange = function () { db.close(); };
        resolve(db);
      };
      req.onerror = function () { reject(req.error || new Error('Could not open local storage')); };
      req.onblocked = function () { reject(new Error('Local storage is blocked by another tab')); };
    });
    return dbp;
  }

  function tx(store, mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(store, mode);
        var out;
        try { out = fn(t.objectStore(store), t); }
        catch (e) { return reject(e); }
        t.oncomplete = function () { resolve(out); };
        t.onerror = function () { reject(t.error || new Error('Storage write failed')); };
        t.onabort = function () { reject(t.error || new Error('Storage transaction aborted')); };
      });
    });
  }

  function wrap(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  var Store = {
    available: function () { return typeof indexedDB !== 'undefined'; },

    /** Save a record + its blob. Returns the stored record. */
    put: function (record, blob) {
      return tx(BLOBS, 'readwrite', function (s) { s.put({ id: record.id, blob: blob }, record.id) })
        .then(function () {
          var copy = Object.assign({}, record);
          return tx(META, 'readwrite', function (s) { s.put(copy); }).then(function () { return copy; });
        });
    },

    /** All file records (no blobs). */
    all: function () { return tx(META, 'readonly', function (s) { return wrap(s.getAll()); }); },

    get: function (id) { return tx(META, 'readonly', function (s) { return wrap(s.get(id)); }); },

    blob: function (id) {
      return tx(BLOBS, 'readonly', function (s) {
        return wrap(s.get(id)).then(function (row) { return row ? row.blob : null; });
      });
    },

    /**
     * Stream a stored file in from disk so large uploads never have to be
     * re-read: File objects are already disk-backed for IndexedDB.
     */
    replace: function (id, record, blob) { return Store.put(record, blob); },

    remove: function (id) {
      return tx(BLOBS, 'readwrite', function (s) { s.delete(id); })
        .then(function () { return tx(META, 'readwrite', function (s) { s.delete(id); }); });
    },

    clear: function () {
      return tx(BLOBS, 'readwrite', function (s) { s.clear(); })
        .then(function () { return tx(META, 'readwrite', function (s) { s.clear(); }); });
    },

    usage: function () {
      if (navigator.storage && navigator.storage.estimate) return navigator.storage.estimate();
      return Promise.resolve({ usage: 0, quota: 0 });
    }
  };

  global.NenduStore = Store;
})(window);
