const { useState, useEffect } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { cityMapping } from "city-timezones";
export { Clock };
import i18next from "i18next";

const Clock = (props) => {
    const [date, setDate] = useState(new Date());
    const [timezone, setTimezone] = useState(props.timezone);
    let timerID = 0;

    useEffect(() => {
        setTimeout(() => {
            timerID = setInterval(() => {
                setDate(new Date())
            }, 1000)
        }, 1000 - new Date().getMilliseconds());

        return () => {
            clearInterval(timerID);
        };
    }, []);

    function getItems(input) {
        const inputUpper = input.toLocaleUpperCase();

        return cityMapping
            .filter(item => item.city.toLocaleUpperCase().includes(inputUpper))
            .map(item => ({
                label: item.city + ', ' + item.country,
                value: item.timezone
            }));
    }

    return (
        <div className="clock">
            <div className="time-zone-name">
                <AutocompleteDropdown text={props.city + ', ' + props.country} getItems={(input) => getItems(input)} onChange={(value) => setTimezone(value)} />
            </div>
            <div className="time">
                {date.toLocaleTimeString([], { timeZone: timezone, hour12: false })}
            </div>
            <div className="remove">
                <button onClick={() => props.removeCallback(props.id)}>{i18next.t('Remove')}</button>
            </div>
        </div>
    );
}