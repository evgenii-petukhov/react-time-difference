const { useState, useEffect } = React
import { Clock } from "./clock";
export { ClockWrapper };
import i18next from "i18next";
import { cityMapping } from "city-timezones";

const ClockWrapper = (props) => {
    const [idCounter, setIdCounter] = useState(0);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        city: props.defaultCity,
        country: props.defaultCountry,
        timezone: props.defaultTimezone
    }]);
    const [defaultTimezone, setDefaultTimezone] = useState(props.defaultTimezone);
    const [defaultCity, setDefaultCity] = useState(props.defaultCity);
    const [defaultCountry, setDefaultCountry] = useState(props.defaultCountry);

    useEffect(() => {
        new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(cityMapping.map(item => ({
                        city: item.city,
                        country: item.country,
                        timezone: item.timezone,
                        distance: getDistance(position.coords.latitude, position.coords.longitude, item.lat, item.lng)
                    })).sort((a, b) => a.distance - b.distance)[0]);
                }, () => reject());
            } else {
                reject();
            }
        }).then(cityInfo => {
            setDefaultCity(cityInfo.city);
            setDefaultCountry(cityInfo.country);
            setDefaultTimezone(cityInfo.timezone);
            setAddedTimeZones([{
                id: idCounter,
                city: cityInfo.city,
                country: cityInfo.country,
                timezone: cityInfo.timezone
            }]);
        }, () => {});
    }, []);

    // https://www.geeksforgeeks.org/program-distance-two-points-earth/
    function getDistance(lat1, lon1, lat2, lon2) {

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        let r = 6371; // Radius of earth in kilometers. Use 3956 for miles
        return (c * r);
    }

    function addClock() {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => [...prev, {
            id: newIdCounter,
            city: defaultCity,
            country: defaultCountry,
            timeZone: defaultTimezone
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
                {addedTimeZones.map(settings => <Clock key={settings.id} id={settings.id} city={settings.city} country={settings.country} timezone={settings.timezone} removeCallback={removeClockById} />)}
            </div>
        </div>
    );
}