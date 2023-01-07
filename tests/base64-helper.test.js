import downloadAndEncodeToBase64 from '../src/helpers/base64-helper';

describe('downloadAndEncodeToBase64', () => {
    it('image/jpeg', () => {
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
                readAsDataURL: jest.fn(() =>  onloadRef({
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
        return downloadAndEncodeToBase64('https://127.0.0.1/').then(response => {
            // Assert
            expect(response).toBe(sampleResponse);
        });
    });
});