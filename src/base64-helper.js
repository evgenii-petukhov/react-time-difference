export { downloadAndEncodeToBase64 };

async function downloadAndEncodeToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise(callback => {
        let reader = new FileReader();
        reader.onload = function () { callback(this.result); };
        reader.readAsDataURL(blob);
    });
}