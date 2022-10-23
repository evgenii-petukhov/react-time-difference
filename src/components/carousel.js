export { Carousel };

const Carousel = (props) => {
    const carouselId = `clock-image-carousel-${props.clockId}`;

    return props.images && <div id={carouselId} className={`carousel slide ${props.isChangedManually ? '' : 'default-images'}`} data-bs-ride="carousel">
        <div className="carousel-indicators">
            {
                props.images.map((_, index) => <button type="button"
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    key={index}></button>)
            }
        </div>
        <div className="carousel-inner">
            {
                props.images.map((image, index) => <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <div className="location-image"
                    style={{background: `url('${image}') center center no-repeat`}}></div>
                </div>)
            }
        </div>
    </div>;
}