const { useState, useEffect, useRef } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { Time } from "./time";
import { findCitiesByName } from "./geo-helper";
import { searchPhotos } from "./pexels-helper";
import i18next from "i18next";

export { Clock };

const Clock = (props) => {
    const [label, setLabel] = useState(`${props.city}, ${props.country}`);
    const [timezone, setTimezone] = useState(props.timezone);
    const [image, setImage] = useState(props.image);
    const [isChangedManually, setIsChangedManually] = useState(false);
    const clockComponentRef = useRef(null);

    useEffect(() => {
        if (!isChangedManually) {
            setLabel(`${props.city}, ${props.country}`);
            setTimezone(props.timezone);
        }
        if (!image) {
            setImage(props.image);
        }
    });

    useEffect(() => {
        clockComponentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, []);

    function getItems(input) {
        const localTimezoneOffset = getOffset(props.defaultTimezone);

        return findCitiesByName(input, 10).map(item => {
            const timezoneDiff = (getOffset(item.timezone) - localTimezoneOffset) / 60;
            return {
                label: `${item.city}, ${item.country}`,
                diff: `${timezoneDiff > 0 ? '+' : ''}${timezoneDiff}${i18next.t('h')}`,
                location: {
                    city: item.city,
                    country: item.country,
                    iso2: item.iso2,
                    timezone: item.timezone
                }
            };
        });
    }

    const getOffset = (timeZone = 'UTC', date = new Date()) => {
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return (tzDate.getTime() - utcDate.getTime()) / 6e4;
      }

    function onTimezoneChanged(label, location) {
        setIsChangedManually(true);
        setLabel(label);
        setTimezone(location.timezone);
        searchPhotos(location.country).then(response => {
            if (response.photos.length) {
                setImage(response.photos[0].src.large);
            }
        }).catch(() => setImage(null));
        props.onChange?.(props.id, location);
    }

    return <div className="clock-container" ref={clockComponentRef}>
        <div className="clock">
            <div className="time">
                <Time date={props.date} timezone={timezone} />
            </div>
            <div>
                <AutocompleteDropdown
                    text={label}
                    getItems={getItems}
                    onTimezoneChanged={onTimezoneChanged} />
            </div>
            {image && <div className="location-image" style={{background: `url('${image}') center center no-repeat`}}></div>}
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.onAdd(props.id)}>{i18next.t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.onRemove(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    </div>;
}