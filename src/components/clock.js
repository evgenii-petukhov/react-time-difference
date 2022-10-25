const { useState, useEffect, useRef } = React;
import i18next from "i18next";
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { Carousel } from "./carousel";
import { Time } from "./time";
import { findCitiesByName } from "../helpers/geo-helper";
import { searchPhotos } from "../helpers/pexels-helper";
import { downloadAndEncodeToBase64 } from "../helpers/base64-helper";

export { Clock };

const dropdownCityLimit = 10;

const Clock = (props) => {
    const [location, setLocation] = useState(props.location);
    const [images, setImages] = useState(props.images);
    const [isChangedManually, setIsChangedManually] = useState(false);
    const clockComponentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isChangedManually) {
            setLocation(props.location);
        }
    });

    useEffect(() => {
        clockComponentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, []);

    useEffect(() => {
        setImages(props.images);
    }, [props.images]);

    function onTimezoneChanged(location) {
        setIsChangedManually(true);
        setLocation(location);
        setImages(null);
        setIsLoading(true);
        searchPhotos(location.country)
            .then(urls => Promise.allSettled(urls.map(url => downloadAndEncodeToBase64(url)))
                .then(results => {
                    const blobs = results.filter(r => r.status === 'fulfilled').map(r => r.value);
                    setImages(blobs);
                    setIsLoading(false);
                })
                .catch(() => {
                    setImages(null);
                    setIsLoading(false);
                }));
        props.onChange?.(props.id, location);
    }

    return <div className="clock-container" ref={clockComponentRef}>
        <div className="clock">
            <div className="time-container">
                <Time date={props.date} timezone={location.timezone} updateTimeDelta={props.updateTimeDelta} />
            </div>
            <div className="location-name">
                <AutocompleteDropdown
                    text={location.city}
                    location={location}
                    getItems={input => findCitiesByName(input, props.defaultTimezone, dropdownCityLimit)}
                    onTimezoneChanged={onTimezoneChanged} />
            </div>
            {
                isLoading
                    ? <div className="loading"><span className="spinner-border" role="status"></span> {i18next.t('Loading')}</div>
                    : (
                        images && images.length 
                            ? <div className="carousel-container">
                                <Carousel clockId={props.id} images={images} isChangedManually={isChangedManually} />
                            </div> 
                            : <div className="loading">{i18next.t('Not found')}</div>
                    )
            }
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.onAdd(props.id)}>{i18next.t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.onRemove(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    </div>;
}