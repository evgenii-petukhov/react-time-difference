import { createClient } from 'pexels';
import getCachedImages from './image-cache';
import urlCacheHelper from './url-cache-helper';
import downloadAndEncodeToBase64 from "./base64-helper";

const apiKey = '563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9';
const picturesPerPage = 3;

const client = createClient(apiKey);

export default function downloadPhotos(country) {
    return new Promise(resolve => searchPhotos(country).then(urls => {
        Promise.allSettled(urls.map(url => downloadAndEncodeToBase64(url))).then(results => {
            const blobs = results.filter(r => r.status === 'fulfilled').map(r => r.value);
            resolve(blobs);
        });
    }));
}

function searchPhotos(country) {
    country = country.toLocaleLowerCase();
    const cachedImages = getCachedImages(country);
    const defaultResponse = [`images/${country}.jpeg`];
    return cachedImages.length ? Promise.resolve(cachedImages) : new Promise(resolve => {
        urlCacheHelper.get(country).then(urls => resolve(urls)).catch(() => {
            client.photos.search({ 
                query: country, 
                per_page: picturesPerPage,
                size: 'large',
                orientation: 'landscape'
            }).then(response => {
                if (response.photos.length) {
                    const urls = response.photos.map(photo => photo.src.large);
                    urlCacheHelper.set(country, urls);
                    resolve(urls);
                } else {
                    resolve(defaultResponse);
                }
            }).catch(() => resolve(defaultResponse));
        });
    });
}