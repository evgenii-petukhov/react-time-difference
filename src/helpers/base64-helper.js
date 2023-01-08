export default function downloadAndEncodeToBase64(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.ok ? (typeof response.blob === 'function' ? response.blob() : null) : null)
            .then(blob => {
                if (blob && blob.type === 'image/jpeg') {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(blob);
                } else {
                    reject();
                }
            });
    });
}