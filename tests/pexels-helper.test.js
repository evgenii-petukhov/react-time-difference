import { when } from 'jest-when';
import downloadPhotos from '../src/helpers/pexels-helper';

import { createClient } from 'pexels';
import getCachedImages from "../src/helpers/image-cache";
import downloadAndEncodeToBase64 from "../src/helpers/base64-helper";
import urlCacheHelper from "../src/helpers/url-cache-helper";

const sampleCountry = 'argentina';
const sampleResponse = 'data:image/jpeg;base64,...';
const sampleImageUrl = 'https://images.pexels.com/photos/11126448/pexels-photo-11126448.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const urlCacheName = 'urlCache';
const urlCacheLimit = 5;

// https://stackoverflow.com/questions/45006254/how-to-change-the-behaviour-of-a-mocked-import
// https://stackoverflow.com/a/45007792
jest.mock("pexels", () => ({
    createClient: jest.fn()
}));
jest.mock("../src/helpers/image-cache", () => jest.fn());
jest.mock("../src/helpers/base64-helper", () => jest.fn());
jest.mock("../src/helpers/url-cache-helper", () => ({
    get: jest.fn(),
    set: jest.fn()
}));
jest.mock('../src/settings', () => ({
    __esModule: true,
    default: {
        urlCache: {
            name: urlCacheName,
            limit: urlCacheLimit
        },
        pexels: {
            apiKey: '',
            limit: 3
        }
    }
}));

describe('downloadPhotos', () => {
    beforeEach(() => {
        getCachedImages.mockReset();
        downloadAndEncodeToBase64.mockReset();
        urlCacheHelper.get.mockReset();
        createClient.mockReset();
    });

    it('should return an empty array, if a country does not exist in the image-cache, url-cache, and Pexels is unavailable', () => {
        // Arrange
        createClient.mockReturnValue({
            photos: {
                search: jest.fn().mockRejectedValue()
            }
        });
        getCachedImages.mockReturnValue([]);
        downloadAndEncodeToBase64.mockRejectedValue();
        urlCacheHelper.get.mockRejectedValue();

        // Act
        const result = downloadPhotos(sampleCountry);

        //Assert
        expect(result).resolves.toEqual([]);
    });

    it('should return an empty array, if a country does not exist in the image-cache and url-cache, Pexels returns 0 pictures', () => {
        // Arrange
        createClient.mockReturnValue({
            photos: {
                search: jest.fn().mockResolvedValue({
                    photos: []
                })
            }
        });
        getCachedImages.mockReturnValue([]);
        urlCacheHelper.get.mockRejectedValue();

        // Act
        const result = downloadPhotos(sampleCountry);

        //Assert
        expect(result).resolves.toEqual([]);
    });

    [1, 2, 3].forEach(itemCount => {
        it(`should return array which contains ${itemCount} pictures, if a country does not exist in the image-cache and url-cache, Pexels returns ${itemCount} pictures`, () => {
            // Arrange
            createClient.mockReturnValue({
                photos: {
                    search: jest.fn().mockResolvedValue({
                        photos: Array.from({length: itemCount}, () => ({
                            src: {
                                large: sampleImageUrl
                            }
                        }))
                    })
                }
            });
            getCachedImages.mockReturnValue([]);
            downloadAndEncodeToBase64.mockResolvedValue(sampleResponse);
            urlCacheHelper.get.mockRejectedValue();
    
            // Act
            const result = downloadPhotos(sampleCountry);
    
            //Assert
            expect(result).resolves.toEqual(Array.from({ length: itemCount }, () => sampleResponse));
        });
    });

    it(`should return array which contains 3 pictures, if a country does not exist in the image-cache, url-cache, and Pexels returns 3 pictures, only 2 can be downloaded`, () => {
        // Arrange
        createClient.mockReturnValue({
            photos: {
                search: jest.fn().mockResolvedValue({
                    photos: [{
                        src: { 
                            large: 'url1'
                        }
                    }, {
                        src: { 
                            large: 'url2'
                        }
                    }, {
                        src: { 
                            large: 'url3'
                        }
                    }]
                })
            }
        });
        getCachedImages.mockReturnValue([]);
        when(downloadAndEncodeToBase64).calledWith('url1').mockResolvedValueOnce(sampleResponse);
        when(downloadAndEncodeToBase64).calledWith('url2').mockRejectedValueOnce(sampleResponse);
        when(downloadAndEncodeToBase64).calledWith('url3').mockResolvedValueOnce(sampleResponse);
        urlCacheHelper.get.mockRejectedValue();

        // Act
        const result = downloadPhotos(sampleCountry);

        //Assert
        expect(result).resolves.toEqual(Array.from({ length: 2 }, () => sampleResponse));
    });
});