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

// Установка: Кэшируем всю статику
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Активация: Очищаем старый кэш при обновлении версии
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

// Обработка сетевых запросов
self.addEventListener('fetch', event => {
    // Стратегия Network First для динамического API каталога
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone()); // Сохраняем свежие данные в кэш
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(event.request); // Если сети нет — берем последний слепок из кэша
                })
        );
    } else {
        // Стратегия Cache First для раздачи структуры интерфейса (офлайн доступность сайта)
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});
