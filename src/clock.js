const { useState, useEffect } = React
import { AutocompleteDropdown } from "./autocomplete-dropdown";
import { cityMapping } from "city-timezones";
export { Clock };
import i18next from "i18next";

const Clock = (props) => {
    const [date, setDate] = useState(new Date());
    const [timezone, setTimezone] = useState(props.timezone);
    const [city, setCity] = useState(props.city);
    const [country, setCountry] = useState(props.country);

    let timerID = 0;

    useEffect(() => {
        if (timerID === 0) {
            setTimeout(() => {
                timerID = setInterval(() => setDate(new Date()), 1000);
            }, 1000 - new Date().getMilliseconds());
        }

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
            setTimeout(() => {
                setCity(cityInfo.city);
                setCountry(cityInfo.country);
                setTimezone(cityInfo.timezone);
                props.setDefaults(cityInfo.city, cityInfo.country, cityInfo.timezone);
            });

        }, () => {});

        return () => {
            clearInterval(timerID);
        };
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
                <AutocompleteDropdown
                    text={city + ', ' + country}
                    getItems={(input) => getItems(input)} 
                    onChange={(value) => setTimezone(value)} />
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