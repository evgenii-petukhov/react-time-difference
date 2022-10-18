const { useState, useEffect } = React
import { Clock } from "./clock";
import { cityMapping } from "city-timezones";

export { ClockCollection };

const ClockCollection = (props) => {
    const [idCounter, setIdCounter] = useState(0);
    const [addedTimeZones, setAddedTimeZones] = useState([{
        id: idCounter,
        location: {
            city: props.defaultCity,
            country: props.defaultCountry,
            timezone: props.defaultTimezone
        }
    }]);
    const [defaultLocation, setDefaultLocation] = useState(({
        city: props.defaultCity,
        country: props.defaultCountry,
        timezone: props.defaultTimezone,
    }));

    useEffect(() => {
        new Promise(resolve => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(cityMapping.map(item => ({
                        location: {
                            city: item.city,
                            country: item.country,
                            timezone: item.timezone,
                        },
                        distance: getDistance(position.coords.latitude, position.coords.longitude, item.lat, item.lng)
                    })).sort((a, b) => a.distance - b.distance)[0]);
                });
            }
        }).then(cityInfo => {
            setDefaultLocation(cityInfo.location);
            setAddedTimeZones([{
                id: idCounter,
                location: cityInfo.location
            }]);
        });
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

    function addClock(id) {
        const newIdCounter = idCounter + 1;
        setIdCounter(newIdCounter);
        setAddedTimeZones((prev) => {
            const index = prev.findIndex((element) => element.id === id);
            prev.splice(index + 1, 0, {
                id: newIdCounter,
                location: defaultLocation
            });
            return [...prev];
        });
    }

    function removeClockById(id) {
        if (addedTimeZones.length === 1) return;
        setAddedTimeZones((prev) => prev.filter((element) => element.id !== id));
    }

    return <div className="clock-collection">
    {
        addedTimeZones.map(settings => <Clock key={settings.id}
            id={settings.id}
            city={settings.location.city}
            country={settings.location.country}
            timezone={settings.location.timezone}
            removeCallback={removeClockById}
            addCallback={addClock} />)
    }
    </div>;
}