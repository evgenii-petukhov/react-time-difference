import { getNearestLocation } from '../src/helpers/geo-helper';
import { locations, cityNames } from './testData';

describe('getNearestLocation', () => {
    Object.keys(locations).forEach(city => {
        it(`should return ${city} for lat = ${locations[city].lat} and lng = ${locations[city].lng}`, () => {
            const result = getNearestLocation(locations[city].lat, locations[city].lng);
            expect(result.city).toBe(cityNames[city]);
        });
    });
});