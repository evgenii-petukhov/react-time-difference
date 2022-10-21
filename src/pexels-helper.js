import { createClient } from 'pexels';

export { searchPhotos };

const urlCacheName = 'urlCache';
const urlCacheLimit = 100;
const apiKey = '563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9';

const client = createClient(apiKey);

function searchPhotos(query) {
    let urlCache = JSON.parse(localStorage.getItem(urlCacheName) || '[]');
    const index = urlCache.findIndex(el => el.query === query);

    return index > -1 ? Promise.resolve(urlCache[index].url) : new Promise((resolve, reject) => {
        client.photos.search({ 
            query, 
            per_page: 1,
            size: 'large',
            orientation: 'landscape'
        }).then(response => {
            if (response.photos.length) {
                const url = response.photos[0].src.large;
                urlCache = urlCache.length >= urlCacheLimit ? [] : urlCache;
                urlCache.push(({
                    query: query,
                    url: url,
                    date: new Date()
                }));
                localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
                resolve(url);
            } else {
                reject();
            }
        });
    });
}