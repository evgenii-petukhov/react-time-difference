import { createClient } from 'pexels';
import getCachedImages from './image-cache';
import urlCacheHelper from './url-cache-helper';
import downloadAndEncodeToBase64 from "./base64-helper";
import settings from '../settings';

const client = createClient(settings.pexels.apiKey);

export default function downloadPhotos(country) {
    return new Promise(async resolve => {
        const urls = await searchPhotos(country);
        const downloads = await Promise.allSettled(urls.map(url => downloadAndEncodeToBase64(url)));
        return resolve(downloads.filter(d => d.status === 'fulfilled').map(d => d.value));
    });
}

function searchPhotos(country) {
    country = country.toLocaleLowerCase();
    const cachedImages = getCachedImages(country);
    const defaultResponse = [`images/${country}.jpeg`];
    return cachedImages.length ? Promise.resolve(cachedImages) : new Promise(resolve => {
        urlCacheHelper.get(country).then(urls => resolve(urls)).catch(() => {
            client.photos.search({ 
                query: country, 
                per_page: settings.pexels.picturesPerPage,
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