export { isImageCached };

function isImageCached(country) {
    const images = require.context("../images", false, /\.(png|jpe?g|svg)$/).keys();
    const index = images.findIndex(key => key ===`./${country.toLocaleLowerCase()}.jpeg`);
    return index > -1;
}