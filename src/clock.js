const { useState, useEffect, useRef } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { Time } from "./time";
import { findCitiesByName } from "./geo-helper";
import i18next from "i18next";

export { Clock };

const Clock = (props) => {
    const [label, setLabel] = useState(`${props.city}, ${props.country}`);
    const [date, setDate] = useState(new Date());
    const [timezone, setTimezone] = useState(props.timezone);
    const [isChangedManually, setIsChangedManually] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const endOfComponentRef = useRef(null);

    useEffect(() => {
        if (!isInitialized) {
            endOfComponentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
            setIsInitialized(true);
        }

        if (!isChangedManually) {
            setLabel(`${props.city}, ${props.country}`);
            setTimezone(props.timezone);
        }

        setDate(props.date);
    });

    function getItems(input) {
        return findCitiesByName(input, 10).map(item => ({
            label: `${item.city}, ${item.country}`,
            value: item.timezone
        }));
    }

    function onTimezoneSelected(item) {
        setIsChangedManually(true);
        setLabel(item.label);
        setTimezone(item.value);
    }

    return <div className="clock-container" ref={endOfComponentRef}>
        <div className="clock">
            <div className="time">
                <Time date={date} timezone={timezone} />
            </div>
            <div className="location-name">
                <AutocompleteDropdown
                    text={label}
                    disabled={props.disabled}
                    getItems={getItems}
                    onTimezoneSelected={onTimezoneSelected} />
            </div>
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.addCallback(props.id)}>{i18next.t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.removeCallback(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    </div>;
}