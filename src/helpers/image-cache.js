export { isImageCached };

const images = require.context("../images", false, /\.(png|jpe?g|svg)$/).keys();

function isImageCached(country) {
    const index = images.findIndex(key => key ===`./${country.toLocaleLowerCase()}.jpeg`);
    return index > -1;
}