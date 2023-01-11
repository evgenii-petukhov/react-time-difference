import { getNearestLocation, findCitiesByName } from '../src/helpers/geo-helper';
import { cities, timezones, dropdownOptions } from './testData';

describe('getNearestLocation', () => {
    Object.keys(cities).filter(city => cities[city].lat && cities[city].lng).forEach(city => {
        it(`should return ${city} for lat = ${cities[city].lat} and lng = ${cities[city].lng}`, () => {
            // Arrange

            // Act
            const result = getNearestLocation(cities[city].lat, cities[city].lng);

            // Assert
            expect(result.city).toBe(cities[city].location.city);
        });
    });
});

describe('findCitiesByName', () => {
    it('should return expected results', () => {
        // Arrange

        // Act
        const results = findCitiesByName(cities.london.location.city.toLocaleUpperCase(), timezones.london, 10);

        // Assert
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