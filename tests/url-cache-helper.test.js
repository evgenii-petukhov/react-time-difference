import urlCacheHelper from "../src/helpers/url-cache-helper";
import { imageCacheResults } from './testData';

const urlCacheName = 'urlCache';
const urlCacheLimit = 5;
const sampleCountry = 'argentina';
const sampleUrls = ['images/argentina.jpeg'];
const sampleDate = new Date('2020-01-01');
const sampleCacheItem = {
    query: sampleCountry,
    urls: sampleUrls,
    date: sampleDate
};

jest.mock('../src/settings', () => ({
    __esModule: true,
    default: {
        urlCache: {
            name: urlCacheName,
            limit: urlCacheLimit
        }
    }
}));

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

beforeEach(() => {
    global.localStorage.getItem.mockReset();
    global.localStorage.setItem.mockReset();
});

describe('urlCacheHelper.get', () => {
    describe('cache is not empty', () => {
        beforeEach(() => {
            global.localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(Object.keys(imageCacheResults).map(query => ({
                query,
                urls: imageCacheResults[query],
                date: sampleDate
            }))));
        });
            
        describe('should return a resolved promise', () => {
            Object.keys(imageCacheResults).forEach(key => {
                it(`if ${key} exists in cache`, async () => {
                    // Arrange
    
                    // Act
                    const result = urlCacheHelper.get(key);
    
                    // Assert
                    await expect(result).resolves.toEqual(imageCacheResults[key]);
                    expect(global.localStorage.getItem).toHaveBeenNthCalledWith(1, urlCacheName);
                });
            });
        });
    
        describe('should return a rejected promise', () => {
            it('if a country does not exist in cache', async () => { 
                // Arrange
    
                // Act  
                const result = urlCacheHelper.get('test');
    
                // Assert
                await expect(result).rejects.toBeUndefined();
                expect(global.localStorage.getItem).toHaveBeenNthCalledWith(1, urlCacheName);
            });
        });
    });

    describe('cache is empty', () => {
        describe('should return a rejected promise', () => {
            [JSON.stringify([]), ''].forEach(value => {
                it('if urlCache is an empty array', async () => { 
                    // Arrange        
                    global.localStorage.getItem = jest.fn().mockReturnValue(value);
    
                    // Act  
                    const result = urlCacheHelper.get(sampleCountry);
        
                    // Assert
                    await expect(result).rejects.toBeUndefined();
                    expect(global.localStorage.getItem).toHaveBeenNthCalledWith(1, urlCacheName);
                });
            });
        });
    });
});

describe('urlCacheHelper.set', () => {
    describe('url should be added to cache', () => {
        jest
            .useFakeTimers()
            .setSystemTime(sampleDate);

        it('if cache is empty', () => {
            // Arrange       
            global.localStorage.getItem = jest.fn().mockReturnValue('');
            global.localStorage.setItem = jest.fn();

            const expectedCache = JSON.stringify([sampleCacheItem]);

            // Act
            urlCacheHelper.set(sampleCountry, sampleUrls);
    
            // Assert
            expect(global.localStorage.getItem).toHaveBeenNthCalledWith(1, urlCacheName);
            expect(global.localStorage.setItem).toHaveBeenNthCalledWith(1, urlCacheName, expectedCache);
        });

        [1, 2, 3, 4].forEach(cacheItemCount => {
            it(`if cache contains ${cacheItemCount} record`, () => {
                // Arrange
                const cache = Array.from({
                    length: cacheItemCount
                }, (_e, index) => ({
                    query: `country-${index + 1}`,
                    urls: [`country-${index + 1}.jpeg`],
                    date: sampleDate
                }));
            
                global.localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(cache));
                global.localStorage.setItem = jest.fn();
    
                // Act
                urlCacheHelper.set(sampleCountry, sampleUrls);
        
                // Assert
                expect(global.localStorage.getItem).toHaveBeenNthCalledWith(1, urlCacheName);
                expect(global.localStorage.setItem).toHaveBeenNthCalledWith(1, urlCacheName, JSON.stringify([... cache, sampleCacheItem]));
            });
        });

        it(`cache is flushed and only current item is saved, if cache reached limit`, () => {
            // Arrange
            const cache = Array.from({
                length: 5
            }, (_e, index) => ({
                query: `country-${index + 1}`,
                urls: [`country-${index + 1}.jpeg`],
                date: sampleDate
            }));

            const mockGetItem = jest.fn().mockReturnValue(JSON.stringify(cache));
            const mockSetItem = jest.fn();
        
            global.localStorage = {
                getItem: mockGetItem,
                setItem: mockSetItem
            };

            // Act
            urlCacheHelper.set(sampleCountry, sampleUrls);
    
            // Assert
            expect(mockGetItem).toHaveBeenNthCalledWith(1, urlCacheName);
            expect(mockSetItem).toHaveBeenNthCalledWith(1, urlCacheName, JSON.stringify([sampleCacheItem]));
        });
    });
});