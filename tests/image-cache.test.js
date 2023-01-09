import getCachedImages from '../src/helpers/image-cache';
import { imageCacheResults } from "./testData";

describe('getCachedImages', () => {
    Object.keys(imageCacheResults).forEach(country => {
        it(`${country} should return ${imageCacheResults[country].length} urls`, () => {
            const urls = getCachedImages(country);
            expect(urls).toHaveLength(imageCacheResults[country].length);
            expect(urls).toEqual(imageCacheResults[country]);
        });
    });

    [null, undefined, 'test'].forEach(country => {
        it(`should return empty array, if country doesn't exist in cache`, () => {
            const urls = getCachedImages(country);
            expect(urls).toHaveLength(0);
            expect(urls).toEqual([]);
        });
    });
});