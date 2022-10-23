const { useState, useEffect, useRef } = React;
import i18next from "i18next";
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { Time } from "./time";
import { findCitiesByName } from "../helpers/geo-helper";
import { searchPhotos } from "../helpers/pexels-helper";
import { downloadAndEncodeToBase64 } from "../helpers/base64-helper";

export { Clock };

const dropdownCityLimit = 10;

const Clock = (props) => {
    const [city, setCity] = useState(props.city);
    const [iso2, setIso2] = useState(props.iso2);
    const [country, setCountry] = useState(props.country);
    const [timezone, setTimezone] = useState(props.timezone);
    const [image, setImage] = useState(props.image);
    const [isChangedManually, setIsChangedManually] = useState(false);
    const clockComponentRef = useRef(null);

    useEffect(() => {
        if (!isChangedManually) {
            setCity(props.city);
            setCountry(props.country);
            setIso2(props.iso2);
            setTimezone(props.timezone);
        }
    });

    useEffect(() => {
        clockComponentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, []);

    useEffect(() => {
        setImage(props.image);
    }, [props.image]);

    function onTimezoneChanged(location) {
        setIsChangedManually(true);
        setCity(location.city);
        setCountry(location.country);
        setIso2(location.iso2);
        setTimezone(location.timezone);
        setImage(null);
        searchPhotos(location.country)
            .then(url => downloadAndEncodeToBase64(url)
                .then(b => setImage(b))
                .catch(() => setImage(null)));
        props.onChange?.(props.id, location);
    }

    return <div className="clock-container" ref={clockComponentRef}>
        <div className="clock">
            <div className="time">
                <Time date={props.date} timezone={timezone} />
            </div>
            <div className="location-name">
                <AutocompleteDropdown
                    text={city}
                    country={country}
                    iso2={iso2}
                    getItems={input => findCitiesByName(input, props.defaultTimezone, dropdownCityLimit)}
                    onTimezoneChanged={onTimezoneChanged} />
            </div>
            {image && <div className={`${image === props.image ? 'default-image' : ''} location-image`} style={{ background: `url('${image}') center center no-repeat` }}></div>}
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.onAdd(props.id)}>{i18next.t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.onRemove(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    </div>;
}