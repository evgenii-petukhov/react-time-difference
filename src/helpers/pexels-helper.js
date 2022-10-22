import { createClient } from 'pexels';
import { isImageCached } from './image-cache';
import * as urlCacheHelper from './url-cache-helper';

export { searchPhotos };

const apiKey = '563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9';

const client = createClient(apiKey);

function searchPhotos(country) {
    country = country.toLocaleLowerCase();
    const cachedImageFilename = `images/${country}.jpeg`;
    return isImageCached(country) ? Promise.resolve(cachedImageFilename) : new Promise(resolve => {
        urlCacheHelper.get(country).then(url => url).catch(() => {
            client.photos.search({ 
                query: country, 
                per_page: 1,
                size: 'large',
                orientation: 'landscape'
            }).then(response => {
                if (response.photos.length) {
                    const url = response.photos[0].src.large;
                    urlCacheHelper.add(country, url);
                    resolve(url);
                } else {
                    resolve(cachedImageFilename);
                }
            }).catch(() => resolve(cachedImageFilename));
        });
    });
}