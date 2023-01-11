import settings from '../settings';

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
    urlCache = urlCache.length >= settings.urlCache.limit ? [] : urlCache.filter(el => el.query !== query);
    urlCache.push({
        query,
        urls,
        date: new Date()
    });
    localStorage.setItem(settings.urlCache.name, JSON.stringify(urlCache));
}

function getCache() {
    return JSON.parse(localStorage.getItem(settings.urlCache.name) || '[]');
}

export default { get, set };