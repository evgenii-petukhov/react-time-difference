import { createClient } from 'pexels';

export { searchPhotos };

const client = createClient('563492ad6f917000010000010b615054bce549e2bdb4a48e0d1520d9');

function searchPhotos(query) {
    return client.photos.search({ 
        query, 
        per_page: 1,
        size: 'large',
        orientation: 'landscape'
    });
}