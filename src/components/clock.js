const { useState, useEffect, useRef } = React;
import { t } from "i18next";
import AutocompleteDropdown from "./autocomplete-dropdown";
import Carousel from "./carousel";
import Time from "./time";
import geoHelper from "../helpers/geo-helper";
import downloadPhotos from "../helpers/pexels-helper";

const dropdownCityLimit = 10;

const Clock = (props) => {
    const [location, setLocation] = useState(props.location);
    const [images, setImages] = useState(props.images);
    const [isShakeAnimationRequired, setIsShakeAnimationRequired] = useState(false);
    const clockComponentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLocation(props.location);
        setImages(props.images);
    }, [props.location, props.images]);

    useEffect(() => {
        clockComponentRef.current.scrollIntoView?.({
            behavior: "smooth",
            block: "end"
        });
    }, []);

    function onTimezoneChanged(location) {
        setIsShakeAnimationRequired(true);
        setLocation(location);
        setImages(null);
        setIsLoading(true);
        downloadPhotos(location.country).then(() => {
            setImages(blobs);
            setIsLoading(false);
        });
        props.onChange?.(props.id, location);
    }

    function getItems(input) {
        return geoHelper
            .findCitiesByName(input, props.location.timezone, dropdownCityLimit)
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    return <div className="clock-container" ref={clockComponentRef}>
        <div className="clock">
            <div className="time-container">
                <Time date={props.date} timezone={location?.timezone} updateTimeDelta={props.updateTimeDelta} />
            </div>
            <div className="location-name">
                <AutocompleteDropdown
                    text={location?.city}
                    location={location}
                    getItems={getItems}
                    onTimezoneChanged={onTimezoneChanged} />
            </div>
            {
                isLoading
                    ? <div className="loading"><span className="spinner-border" role="status"></span> {t('Loading')}</div>
                    : (
                        images && images.length
                            ? <div className="carousel-container">
                                <Carousel clockId={props.id} images={images} isShakeAnimationRequired={isShakeAnimationRequired} />
                            </div>
                            : <div className="loading">{t('Not found')}</div>
                    )
            }
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.onAdd(props.id)}>{t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.onRemove(props.id)}>{t('Remove')}</button>
            </div>
        </div>
    </div>;
}

export default Clock;