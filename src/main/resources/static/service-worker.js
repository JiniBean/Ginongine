const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    '/',
    '/css/component.css',
    '/css/icon.css',
    '/css/main.css',
    '/css/root.css',
    '/css/styles.css',
    '/css/utill.css',
    '/js/module/header.js'
];

// 설치 단계에서 캐시를 생성하고 필요한 파일들을 캐시에 추가
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 요청이 발생할 때 캐시를 확인하고, 있으면 캐시된 응답을 반환
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에 있으면 반환하고, 없으면 네트워크 요청
                return response || fetch(event.request);
            })
    );
});

// 활성화 단계에서 오래된 캐시를 삭제
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });