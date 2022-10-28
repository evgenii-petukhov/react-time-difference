function downloadAndEncodeToBase64(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.ok ? response.blob() : null)
            .then(blob => {
                if (blob && blob.type === 'image/jpeg') {
                    const reader = new FileReader();
                    reader.onload = function () {
                        resolve(this.result);
                    };
                    reader.readAsDataURL(blob);
                } else {
                    reject();
                }
            });
    });
}

export default downloadAndEncodeToBase64;