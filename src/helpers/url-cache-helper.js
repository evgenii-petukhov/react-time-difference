export { get, add };

const urlCacheName = 'urlCache';
const urlCacheLimit = 100;

function get(query) {
    return new Promise((resolve, reject) => {
        const urlCache = getStorage();
        const index = urlCache.findIndex(el => el.query === query);
        if (index > -1) {
            resolve(urlCache[index].url);
        } else {
            reject();
        }
    });
}

function add(query, url) {
    let urlCache = getStorage();
    urlCache = urlCache.length >= urlCacheLimit ? [] : urlCache;
    urlCache.push({
        query,
        url,
        date: new Date()
    });
    localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
}

function getStorage() {
    return JSON.parse(localStorage.getItem(urlCacheName) || '[]');
}