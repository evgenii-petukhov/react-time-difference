const { useState, useEffect } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
export { Clock };

const Clock = (props) => {
    const [date, setDate] = useState(new Date());
    const [timeZone, setTimeZone] = useState(props.selectedTimeZone);
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

    return (
        <div className="clock">
            <div className="time-zone-name">
                <AutocompleteDropdown text={timeZone} items={props.timeZones} onChange={(value) => setTimeZone(value)} />
            </div>
            <div className="time">
                {date.toLocaleTimeString([], { timeZone: timeZone, hour12: false })}
            </div>
            <div className="remove">
                <button onClick={() => props.removeCallback(props.id)}>Remove</button>
            </div>
        </div>
    );
}