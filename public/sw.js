console.log("Service worker loaded!");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("staticCache").then((cache) => {
      return cache.addAll([
        "./",
        "./images/pwa-icon.webp",
        "./manifest.json",
        "./offline.html",
        "./public.js",
      ]);
    })
  );
});

// Cache, Calling Back to Network
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.open("staticCache").then(async (cache) => {
//       const response = await cache.match(event.request);
//       if (!response || response.status === 404) {
//         return cache.match("offline.html");
//       } else {
//         return response;
//       }
//     })
//   );
// });

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("staticCache").then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        cache.put(event.request, networkResponse.clone());

        return networkResponse;
      });

      if (!cachedResponse) {
        return cache.match("offline.html");
      }

      return cachedResponse || fetchedResponse;
    })
  );
});

// Cache then Network
// self.addEventListener("fetch", (event) => {
//   console.log(event.request.destination);
//   var request = event.request;
//   var url = new URL(request.url);

//   if (url.origin === location.origin) {
//     event.respondWith(
//       caches.match(request).then((response) => {
//         return response || fetch(request);
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.open("nextCache").then((cache) => {
//         return fetch(request)
//           .then((liveResponse) => {
//             cache.put(request, liveResponse.clone());

//             return liveResponse;
//           })
//           .catch(() => {
//             return caches.match(request).then((response) => {
//               if (response) return response;

//               return caches.match("./offline.html");
//             });
//           });
//       })
//     );
//   }
// });

self.addEventListener("activate", (event) => {
  const cacheAllowList = ["staticCache"];

  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete all caches that aren't in the allow list:
      return Promise.all(
        keys.map((key) => {
          if (!cacheAllowList.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// self.addEventListener("push", (event) => {
//   const data = event.data.json();
//   console.log("Push recieved!");

//   self.registration.showNotification(data.title, {
//     body: "Notifikasi dari Server",
//   });
// });
