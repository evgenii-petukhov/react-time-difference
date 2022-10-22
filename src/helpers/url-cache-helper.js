export { get, add };

const urlCacheName = 'urlCache';
const urlCacheLimit = 100;

let urlCache = JSON.parse(localStorage.getItem(urlCacheName) || '[]');

function get(query) {
    return new Promise((resolve, reject) => {
        const index = urlCache.findIndex(el => el.query === query);
        if (index > -1) {
            resolve(urlCache[index].url);
        } else {
            reject();
        }
    });
}

function add(query, url) {
    urlCache = urlCache.length >= urlCacheLimit ? [] : urlCache;
    urlCache.push({
        query,
        url,
        date: new Date()
    });
    localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
}