export { get, add };

const urlCacheName = 'urlCache';
const urlCacheLimit = 100;

let urlCache = JSON.parse(localStorage.getItem(urlCacheName) || '[]');

function get(query) {
    return new Promise((resolve, reject) => {
        const index = urlCache.findIndex(el => el.query === query && el.urls);
        if (index > -1) {
            resolve(urlCache[index].urls);
        } else {
            reject();
        }
    });
}

function add(query, urls) {
    urlCache = urlCache.length >= urlCacheLimit ? [] : urlCache.filter(el => el.query !== query);
    urlCache.push({
        query,
        urls,
        date: new Date()
    });
    localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
}