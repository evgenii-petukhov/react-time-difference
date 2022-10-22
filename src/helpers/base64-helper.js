export { downloadAndEncodeToBase64 };

async function downloadAndEncodeToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        if (blob.type === 'image/jpeg') {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(this.result);
            };
            reader.readAsDataURL(blob);
        } else {
            reject();
        }
    });
}