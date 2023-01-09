import { getNearestLocation } from '../src/helpers/geo-helper';
import { cities } from './testData';

describe('getNearestLocation', () => {
    Object.keys(cities).filter(city => cities[city].lat && cities[city].lng).forEach(city => {
        it(`should return ${city} for lat = ${cities[city].lat} and lng = ${cities[city].lng}`, () => {
            const result = getNearestLocation(cities[city].lat, cities[city].lng);
            expect(result.city).toBe(cities[city].location.city);
        });
    });
});