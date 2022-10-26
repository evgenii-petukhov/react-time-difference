export { Carousel };

const Carousel = (props) => {
    const carouselId = `clock-image-carousel-${props.clockId}`;

    return <div id={carouselId} className={`carousel slide ${props.isChangedManually ? '' : 'no-animation'}`} data-bs-ride="true">
        <div className="carousel-inner">
            {
                props.images.map((image, index) => <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <div className="location-image"
                        style={{ background: `url('${image}') center center no-repeat` }}></div>
                </div>)
            }
        </div>
        <div className="carousel-indicators">
            {
                props.images.map((_, index) => <button type="button"
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    key={index}></button>)
            }
        </div>
        {
            props.images.length > 1 && <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
                <span className="visually-hidden">Previous</span>
            </button>
        }
        {
            props.images.length > 1 && <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
                <span className="visually-hidden">Next</span>
            </button>
        }
    </div>;
}