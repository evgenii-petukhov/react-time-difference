const { useState } = React
import { Clock } from "./clock";
import { timeZones } from "./timezones";
export { ClockWrapper };

const ClockWrapper = () => {
    const availableTimeZones = timeZones;//Intl.supportedValuesOf('timeZone');
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [idCounter, setIdCounter] = useState(0);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        timeZone: defaultTimeZone
    }]);

    function addClock() {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => [...prev, { id: newIdCounter, timeZone: defaultTimeZone }]);
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
                {addedTimeZones.map(settings => <Clock key={settings.id} id={settings.id} timeZones={availableTimeZones} selectedTimeZone={settings.timeZone} removeCallback={removeClockById} />)}
            </div>
        </div>
    );
}