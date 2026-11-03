const CACHE_NAME = 'book-catalog-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});
