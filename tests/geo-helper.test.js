import { getNearestLocation, findCitiesByName } from '../src/helpers/geo-helper';
import { cities, timezones, dropdownOptions } from './testData';

describe('getNearestLocation', () => {
    Object.keys(cities).filter(city => cities[city].lat && cities[city].lng).forEach(city => {
        it(`should return ${city} for lat = ${cities[city].lat} and lng = ${cities[city].lng}`, () => {
            const result = getNearestLocation(cities[city].lat, cities[city].lng);
            expect(result.city).toBe(cities[city].location.city);
        });
    });
});

describe('findCitiesByName', () => {
    it('should return expected results', () => {
        const results = findCitiesByName(cities.london.location.city.toLocaleUpperCase(), timezones.london, 10);
        expect(results).toHaveLength(dropdownOptions.length);
        expect(getSortedStringArray(results)).toEqual(getSortedStringArray(dropdownOptions));
    });
});

function getCompareString(location) {
    return `${location.label}, ${location.country}`;
}

function getSortedStringArray(sourceArray) {
    return sourceArray.map(city => getCompareString(city.location)).sort();
}