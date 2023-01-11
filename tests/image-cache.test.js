import getCachedImages from '../src/helpers/image-cache';
import { imageCacheResults } from "./testData";

jest.mock('../src/helpers/image-cache-data', () => ({
    __esModule: true,
    default: {
        argentina: 1,
        hungary: 3,
        'united kingdom': 7
    }
}));

describe('getCachedImages', () => {
    Object.keys(imageCacheResults).forEach(country => {
        it(`${country} should return ${imageCacheResults[country].length} urls`, () => {
            // Arrange

            // Act
            const urls = getCachedImages(country);
            
            // Assert
            expect(urls).toHaveLength(imageCacheResults[country].length);
            expect(urls).toEqual(imageCacheResults[country]);
        });
    });

    [null, undefined, 'test'].forEach(country => {
        it(`should return empty array, if country doesn't exist in cache`, () => {
            // Arrange

            // Act
            const urls = getCachedImages(country);

            // Assert
            expect(urls).toHaveLength(0);
            expect(urls).toEqual([]);
        });
    });
});