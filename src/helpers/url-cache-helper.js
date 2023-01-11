const urlCacheName = 'urlCache';
const urlCacheLimit = 100;

function get(query) {
    const urlCache = getCache();
    return new Promise((resolve, reject) => {
        const index = urlCache.findIndex(el => el.query === query && el.urls);
        if (index > -1) {
            resolve(urlCache[index].urls);
        } else {
            reject();
        }
    });
}

function set(query, urls) {
    let urlCache = getCache();
    urlCache = urlCache.length >= urlCacheLimit ? [] : urlCache.filter(el => el.query !== query);
    urlCache.push({
        query,
        urls,
        date: new Date()
    });
    localStorage.setItem(urlCacheName, JSON.stringify(urlCache));
}

function getCache() {
    return JSON.parse(localStorage.getItem(urlCacheName) || '[]');
}

export default { get, set };