export { getCachedImages };

const cachedQueries = [
    'argentina',
    'australia',
    'austria',
    'belgium',
    'brazil',
    'canada',
    'chile',
    'china',
    'colombia',
    'czech republic',
    'estonia',
    'finland',
    'france',
    'germany',
    'greece',
    'hungary',
    'india',
    'italy',
    'japan',
    'latvia',
    'lithuania',
    'luxembourg',
    'malta',
    'norway',
    'poland',
    'portugal',
    'romania',
    'russia',
    'serbia',
    'south korea',
    'spain',
    'switzerland',
    'turkey',
    'ukraine',
    'united kingdom',
    'united states of america',
    'uruguay',
    'vietnam',    
];

function getCachedImages(query) {
    const index = cachedQueries.findIndex(q => q === query);
    
    return index > -1 ? [
        `images/${query}.jpeg`,
        `images/${query}-2.jpeg`,
        `images/${query}-3.jpeg`
    ] : [];
}