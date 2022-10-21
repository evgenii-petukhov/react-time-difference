export { downloadAndEncodeToBase64 };

function downloadAndEncodeToBase64(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            if (blob.type === 'image/jpeg') {
                const reader = new FileReader();
                reader.onload = function () {
                    resolve(this.result);
                };
                reader.readAsDataURL(blob);
            } else {
                reject();
            }
        }));
}