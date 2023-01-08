import downloadAndEncodeToBase64 from '../src/helpers/base64-helper';

describe('downloadAndEncodeToBase64', () => {
    describe('should return a resolved promise', () => {
        it('if response is ok, content is binary and image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    blob: () => Promise.resolve({
                        type: 'image/jpeg',
                    })
                })
            );
    
            // https://stackoverflow.com/a/66978762
            let onloadRef;
            const sampleResponse = 'data:image/jpeg;base64,...';
            global.FileReader = jest.fn(() => {
                const fileReader = {
                    readAsDataURL: jest.fn(() => onloadRef({
                        target: {
                            result: sampleResponse
                        }
                    }))
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
            await expect(downloadAndEncodeToBase64('https://127.0.0.1/')).resolves.toBe(sampleResponse);
        });
    });

    describe('should return a rejected promise', () => {
        it('if response is not ok', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false
                })
            );
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64('https://127.0.0.1/')).rejects.toBeUndefined();
        });

        it('if response is ok, but content is not binary', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true
                })
            );
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64('https://127.0.0.1/')).rejects.toBeUndefined();
        });

        it('if response is ok, content is binary, but not image/jpeg', async () => {
            // Arrange
            // https://www.leighhalliday.com/mock-fetch-jest
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    blob: () => Promise.resolve({
                        type: 'application/json',
                    })
                })
            );
    
            // Act
            // Assert
            await expect(downloadAndEncodeToBase64('https://127.0.0.1/')).rejects.toBeUndefined();
        });
    });
});