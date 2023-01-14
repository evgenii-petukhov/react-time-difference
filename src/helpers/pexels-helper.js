import { createClient } from 'pexels';
import getCachedImages from './image-cache';
import urlCacheHelper from './url-cache-helper';
import downloadAndEncodeToBase64 from "./base64-helper";
import settings from '../settings';

export default async function downloadPhotos(country) {
    country = country.toLocaleLowerCase();
    const cachedImages = getCachedImages(country);
    const urls = await (cachedImages.length ? Promise.resolve(cachedImages) : searchPhotos(country));
    const downloads = await Promise.allSettled(urls.map(url => downloadAndEncodeToBase64(url)));
    return downloads.filter(d => d.status === 'fulfilled').map(d => d.value);
}

function searchPhotos(country) {
    return new Promise(resolve => {
        urlCacheHelper.get(country)
            .then(cachedUrls => resolve(cachedUrls))
            .catch(() => {
                const defaultResponse = [`images/${country}.jpeg`];
                createClient(settings.pexels.apiKey).photos.search({ 
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