import { cityMapping } from "city-timezones";

export {
    getNearestCity,
    findCitiesByName,
    getTimezoneOffset
};

function getNearestCity(lat, lng) {
    return cityMapping.map(item => ({
        location: {
            city: item.city,
            country: item.country,
            timezone: item.timezone,
        },
        distance: getDistance(lat, lng, item.lat, item.lng)
    })).sort((a, b) => a.distance - b.distance)[0]
}

function findCitiesByName(input, count) {
    input = input.toLocaleUpperCase();

    return cityMapping
        .filter(item => item.timezone !== null
            && `${item.city} ${item.country} ${item.city}|${item.city}, ${item.country}, ${item.city}`.toLocaleUpperCase().includes(input))
        .slice(0, count);
}

function getTimezoneOffset(timeZone = 'UTC', date = new Date()) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return (tzDate.getTime() - utcDate.getTime()) / 6e4;
}

// https://www.geeksforgeeks.org/program-distance-two-points-earth/
function getDistance(lat1, lon1, lat2, lon2) {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    let r = 6371; // Radius of earth in kilometers. Use 3956 for miles
    return (c * r);
}