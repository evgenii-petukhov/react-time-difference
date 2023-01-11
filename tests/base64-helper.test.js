import downloadAndEncodeToBase64 from '../src/helpers/base64-helper';

const sampleUrl = 'https://127.0.0.1/';

describe('downloadAndEncodeToBase64', () => {
    describe('should return a resolved promise', () => {
        it('if response is ok, content is binary and image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const sampleBlob = {
                type: 'image/jpeg',
            };

            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    blob: () => Promise.resolve(sampleBlob)
                })
            );

            const mockReadAsDataUrl = jest.fn(() => onloadRef({
                target: {
                    result: sampleResponse
                }
            }));

            global.fetch = mockFetch;
    
            // https://stackoverflow.com/a/66978762
            let onloadRef;
            const sampleResponse = 'data:image/jpeg;base64,...';
            global.FileReader = jest.fn(() => {
                const fileReader = {
                    readAsDataURL: mockReadAsDataUrl
                };
                Object.defineProperty(fileReader, 'onload', {
                    get() {
                      return this._onload;
                    },
                    set(onload) {
                      onloadRef = onload;
                      this._onload = onload;
                    },
                  });
    
                return fileReader;
            });
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64(sampleUrl)).resolves.toBe(sampleResponse);
            expect(mockFetch).toHaveBeenNthCalledWith(1, sampleUrl);
            expect(mockReadAsDataUrl).toHaveBeenNthCalledWith(1, sampleBlob);
        });
    });

    describe('should return a rejected promise', () => {
        it('if response is not ok', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    ok: false
                })
            );

            global.fetch = mockFetch;
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64(sampleUrl)).rejects.toBeUndefined();
            expect(mockFetch).toHaveBeenNthCalledWith(1, sampleUrl);
        });

        it('if response is ok, but content is not binary', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    ok: true
                })
            );
            global.fetch = mockFetch;
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64(sampleUrl)).rejects.toBeUndefined();
            expect(mockFetch).toHaveBeenNthCalledWith(1, sampleUrl);
        });

        it('if response is ok, content is binary, but not image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    blob: () => Promise.resolve({
                        type: 'application/json',
                    })
                })
            );
            global.fetch = mockFetch;
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64(sampleUrl)).rejects.toBeUndefined();
            expect(mockFetch).toHaveBeenNthCalledWith(1, sampleUrl);
        });
    });
});