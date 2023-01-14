import downloadAndEncodeToBase64 from '../src/helpers/base64-helper';

const sampleUrl = 'https://127.0.0.1/';
const sampleResponse = 'data:image/jpeg;base64,...';

global.fetch = jest.fn();

beforeEach(() => {
    global.fetch.mockReset();
});

describe('downloadAndEncodeToBase64', () => {
    describe('should return a resolved promise', () => {
        it('if response is ok, content is binary and image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const sampleBlob = {
                type: 'image/jpeg',
            };

            const mockBlob = jest.fn().mockResolvedValue(sampleBlob);

            global.fetch.mockResolvedValue({
                ok: true,
                blob: mockBlob
            });

            // https://stackoverflow.com/questions/66964346/how-to-properly-mock-the-file-reader-using-jest/66978762
            // https://stackoverflow.com/a/66978762
            const mockReadAsDataUrl = jest.fn(() => onloadRef({
                target: {
                    result: sampleResponse
                }
            }));
            let onloadRef;
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
            const result = downloadAndEncodeToBase64(sampleUrl);

            // Assert
            await expect(result).resolves.toBe(sampleResponse);
            expect(global.fetch).toHaveBeenNthCalledWith(1, sampleUrl);
            expect(mockReadAsDataUrl).toHaveBeenNthCalledWith(1, sampleBlob);
            expect(mockBlob).toHaveBeenCalledTimes(1);
        });
    });

    describe('should return a rejected promise', () => {
        it('if response is not ok', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const mockBlob = jest.fn();

            global.fetch.mockResolvedValue({
                ok: false,
                blob: mockBlob
            });
    
            // Act
            const result = downloadAndEncodeToBase64(sampleUrl);

            // Assert
            await expect(result).rejects.toBeUndefined();
            expect(global.fetch).toHaveBeenNthCalledWith(1, sampleUrl);
            expect(mockBlob).not.toHaveBeenCalled();
        });

        it('if response is ok, but content is not binary', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            global.fetch.mockResolvedValue({
                ok: true
            });
    
            // Act
            const result = downloadAndEncodeToBase64(sampleUrl);

            // Assert
            await expect(result).rejects.toBeUndefined();
            expect(global.fetch).toHaveBeenNthCalledWith(1, sampleUrl);
        });

        it('if response is ok, content is binary, but not image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            const mockBlob = jest.fn().mockResolvedValue({
                type: 'application/json',
            });

            global.fetch.mockResolvedValue({
                ok: true,
                blob: mockBlob
            });
    
            // Act
            const result = downloadAndEncodeToBase64(sampleUrl);

            // Assert
            await expect(result).rejects.toBeUndefined();
            expect(global.fetch).toHaveBeenNthCalledWith(1, sampleUrl);
            expect(mockBlob).toHaveBeenCalledTimes(1);
        });
    });
});