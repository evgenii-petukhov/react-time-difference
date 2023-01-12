import imageCacheData from "./image-cache-data";

export default function getCachedImages(query) {
    const count = imageCacheData[query] ?? 0;
    return Array.from({
        length: count
    }, (_e, imageCounter) => imageCounter === 0 ? `images/${query}.jpeg` : `images/${query}-${imageCounter + 1}.jpeg`);
}