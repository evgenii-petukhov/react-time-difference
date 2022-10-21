import { createClient } from 'pexels';

export { searchPhotos };

const client = createClient('563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9');

const urlCacheName = 'urlCache';

function searchPhotos(query) {
    let urlCache = JSON.parse(localStorage.getItem(urlCacheName));
    urlCache = (!urlCache || !Array.isArray(urlCache)) ? [] : urlCache;
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
                urlCache.push(({
                    query: query,
                    url: url
                }));
                localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
                resolve(url);
            } else {
                reject();
            }
        });
    });
}