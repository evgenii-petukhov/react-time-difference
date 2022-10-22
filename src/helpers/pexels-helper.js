import { createClient } from 'pexels';
import * as urlCacheHelper from './url-cache-helper';

export { searchPhotos };

const apiKey = '563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9';

const client = createClient(apiKey);

function searchPhotos(city, country) {
    const query = `${city} ${country}`;
    return new Promise(resolve => {
        urlCacheHelper.get(query).then(url => url).catch(() => {
            client.photos.search({ 
                query, 
                per_page: 1,
                size: 'large',
                orientation: 'landscape'
            }).then(response => {
                if (response.photos.length) {
                    const url = response.photos[0].src.large;
                    urlCacheHelper.add(query, url);
                    resolve(url);
                } else {
                    resolve(`images/${country}.jpeg`);
                }
            }).catch(() => resolve(`images/${country}.jpeg`));
        });
    });
}