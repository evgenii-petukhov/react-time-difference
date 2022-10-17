const { useState } = React
import { Clock } from "./clock";
export { ClockWrapper };
import i18next from "i18next";

const ClockWrapper = (props) => {
    const [idCounter, setIdCounter] = useState(0);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        city: props.defaultCity,
        country: props.defaultCountry,
        timeZone: props.timezone
    }]);

    function addClock() {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => [...prev, {
            id: newIdCounter,
            city: props.defaultCity,
            country: props.defaultCountry,
            timeZone: props.timezone
        }]);
    }

    function removeClockById(id) {
        if (addedTimeZones.length === 1) return;
        setAddedTimeZones((prev) => prev.filter((element) => element.id !== id));
    }

    return (
        <div>
            <div className="add-clock-container">
                <button onClick={addClock}>{i18next.t('Add clock')}</button>
            </div>
            <div className="clock-container">
                {addedTimeZones.map(settings => <Clock key={settings.id} id={settings.id} city={settings.city} country={settings.country} timezone={settings.timeZone} removeCallback={removeClockById} />)}
            </div>
        </div>
    );
}