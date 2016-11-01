var staticCacheName = 'tcr-static-v0';
var allCaches = [
    staticCacheName
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                'https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic',
                'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min.js',
                'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-aria.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min.js',
                'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js',
                'https://fonts.gstatic.com/s/roboto/v15/oMMgfZMQthOryQo9n22dcuvvDin1pK8aKteLpeZ5c0A.woff2',
                'https://fonts.gstatic.com/s/roboto/v15/RxZJdnzeo3R5zSexge8UUZBw1xU1rKptJj_0jans920.woff2',
                '/',
                'assets/app.css',
                'manifest.json',
                'assets/svg/menu.svg',
                'shell/shell.component.html',
                'randomizer/randomizer.component.html',
                'class-filter/class-filter.component.html',
                'schedule-display/schedule-display.component.html',
                'app/app-4922fa306a.js'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('tcr-') &&
                        !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
