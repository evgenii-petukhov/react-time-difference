const { useState, useEffect } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { Time } from "./time";
import { cityMapping } from "city-timezones";
import i18next from "i18next";

export { Clock };

const Clock = (props) => {
    const [label, setLabel] = useState(props.city + ', ' + props.country);
    const [timezone, setTimezone] = useState(props.timezone);
    const [isChangedManually, setIsChangedManually] = useState(false);

    useEffect(() => {
        if (!isChangedManually) {
            setLabel(props.city + ', ' + props.country);
            setTimezone(props.timezone);
        }
    });

    function getItems(input) {
        const inputUpper = input.toLocaleUpperCase();

        return cityMapping
            .filter(item => item.city.toLocaleUpperCase().includes(inputUpper) || item.country.toLocaleUpperCase().includes(inputUpper))
            .map(item => ({
                label: item.city + ', ' + item.country,
                value: item.timezone
            }));
    }

    function onTimezoneSelected(item) {
        setIsChangedManually(true);
        setLabel(item.label);
        setTimezone(item.value);
    }

    return <div className="clock-container">
        <div className="clock">
            <div className="location-name">
                <AutocompleteDropdown
                    text={label}
                    disabled={props.disabled}
                    getItems={getItems}
                    onTimezoneSelected={onTimezoneSelected} />
            </div>
            <div className="time">
                <Time timezone={timezone} />
            </div>
            <div className="button-container">
                <button className="btn btn-outline-primary" onClick={() => props.addCallback()}>{i18next.t('Add clock')}</button>
                <button className="btn btn-light btn-remove" onClick={() => props.removeCallback(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    </div>;
}