export { getCachedImages };

const cachedQueries = [
    {
        query: 'argentina',
    },
    {
        query: 'australia',
    },
    {
        query: 'austria',
    },
    {
        query: 'belgium',
    },
    {
        query: 'brazil',
    },
    {
        query: 'canada',
    },
    {
        query: 'chile',
    },
    {
        query: 'china',
    },
    {
        query: 'colombia',
    },
    {
        query: 'czech republic',
    },
    {
        query: 'estonia',
    },
    {
        query: 'finland',
    },
    {
        query: 'france',
    },
    {
        query: 'germany',
    },
    {
        query: 'greece',
    },
    {
        query: 'hungary',
        count: 3
    },
    {
        query: 'india',
    },
    {
        query: 'italy',
    },
    {
        query: 'japan',
    },
    {
        query: 'latvia',
    },
    {
        query: 'lithuania',
    },
    {
        query: 'luxembourg',
    },
    {
        query: 'malta',
    },
    {
        query: 'norway',
    },
    {
        query: 'poland',
    },
    {
        query: 'portugal',
    },
    {
        query: 'romania',
    },
    {
        query: 'russia',
    },
    {
        query: 'serbia',
        count: 3
    },
    {
        query: 'south korea',
    },
    {
        query: 'spain',
    },
    {
        query: 'switzerland',
    },
    {
        query: 'turkey',
    },
    {
        query: 'ukraine',
    },
    {
        query: 'united kingdom',
        count: 7
    },
    {
        query: 'united states of america',
    },
    {
        query: 'uruguay',
    },
    {
        query: 'vietnam',
    },
];

function getCachedImages(query) {
    const index = cachedQueries.findIndex(q => q.query === query);
    const images = [];
    if (index > -1) {
        const cachedQuery = cachedQueries[index];
        for(let imageCounter = 1; imageCounter <= cachedQuery.count ?? 1; imageCounter++) {
            images.push(imageCounter === 1 ? `images/${query}.jpeg` : `images/${query}-${imageCounter}.jpeg`);
        }
    }
    return images;
}