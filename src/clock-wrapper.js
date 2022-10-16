const { useState } = React
import { lookupViaCity } from "city-timezones";
import { Clock } from "./clock";
export { ClockWrapper };

const ClockWrapper = () => {
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityInfo = lookupViaCity(defaultTimeZone.split('/')[1])[0];
    let defaultCity = cityInfo.city + ', ' + cityInfo.country;
    const [idCounter, setIdCounter] = useState(0);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        city: defaultCity,
        timeZone: defaultTimeZone
    }]);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=en`)
                .then((response) => response.json())
                .then((data) => {
                    defaultCity = data.address.city + ', ' + data.address.country;
                });
        });
    }

    function addClock() {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => [...prev, { id: newIdCounter, city: defaultCity, timeZone: defaultTimeZone }]);
    }

    function removeClockById(id) {
        if (addedTimeZones.length === 1) return;
        setAddedTimeZones((prev) => prev.filter((element) => element.id !== id));
    }

    return (
        <div>
            <div className="add-clock-container">
                <button onClick={addClock}>Add clock</button>
            </div>
            <div className="clock-container">
                {addedTimeZones.map(settings => <Clock key={settings.id} id={settings.id} selectedPosition={settings.city} selectedTimeZone={settings.timeZone} removeCallback={removeClockById} />)}
            </div>
        </div>
    );
}