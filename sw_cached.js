const cacheName = "v1";

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("SW: Installed");
});

// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("SW: Activated");

  // remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache != cacheName) {
            console.log("SW: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("SW: Fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => {
        caches.match(e.request).then((res) => res);
      })
  );
});
