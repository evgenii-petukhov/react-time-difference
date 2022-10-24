import { createClient } from 'pexels';
import { getCachedImages } from './image-cache';
import * as urlCacheHelper from './url-cache-helper';

export { searchPhotos };

const apiKey = '563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9';
const picturesPerPage = 3;

const client = createClient(apiKey);

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
                    urlCacheHelper.add(country, urls);
                    resolve(urls);
                } else {
                    resolve(defaultResponse);
                }
            }).catch(() => resolve(defaultResponse));
        });
    });
}