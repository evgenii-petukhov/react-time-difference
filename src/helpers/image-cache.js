import imageCacheData from "./image-cache-data";

export default function getCachedImages(query) {
    const images = [];
    const count = imageCacheData[query] ?? 0;
    for (let imageCounter = 1; imageCounter <= count; imageCounter++) {
        images.push(imageCounter === 1 ? `images/${query}.jpeg` : `images/${query}-${imageCounter}.jpeg`);
    }
    return images;
}