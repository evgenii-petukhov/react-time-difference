import urlCacheHelper from "../src/helpers/url-cache-helper"; '../src/helpers/url-cache-helper';
import { imageCacheResults } from './testData';

const urlCacheName = 'urlCache';

describe('urlCacheHelper.get', () => {
    const mockGetItem = jest.fn().mockReturnValue(JSON.stringify(Object.keys(imageCacheResults).map(query => ({
        query,
        urls: imageCacheResults[query],
        date: new Date()
    }))));

    global.localStorage = {
        getItem: mockGetItem,
        setItem: jest.fn(),
    };

    describe('should return a resolved promise', () => {
        Object.keys(imageCacheResults).forEach(key => {
            it(`if ${key} exists in cache`, () => {
                // Arrange

                // Act
                const result = urlCacheHelper.get(key);

                // Assert
                expect(result).resolves.toEqual(imageCacheResults[key]);
                expect(mockGetItem).toHaveBeenNthCalledWith(1, urlCacheName);
            });
        });
    });

    describe('should return a rejected promise', () => {
        it('if a country does not exist in cache', () => { 
            // Arrange

            // Act  
            const result = urlCacheHelper.get('test');

            // Assert
            expect(result).rejects.toBeUndefined();
            expect(mockGetItem).toHaveBeenNthCalledWith(1, urlCacheName);
        });
    });
});