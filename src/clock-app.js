import { cityMapping } from "city-timezones";
import { lookupViaCity } from "city-timezones";
import { ClockWrapper } from "./clock-wrapper";

export default class ClockApp {
    constructor(options) {
        const domContainer = document.querySelector(options.selector);
        const root = ReactDOM.createRoot(domContainer);

        const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(cityMapping.map(item => ({
                        city: item.city,
                        country: item.country,
                        distance: this.getDistance(position.coords.latitude, position.coords.longitude, item.lat, item.lng)
                    })).sort((a, b) => a.distance - b.distance)[0]);
                }, () => reject());
            } else {
                reject();
            }
        }).then(cityInfo => cityInfo, () => lookupViaCity(defaultTimeZone.split('/')[1])[0]).then((cityInfo) => {
            root.render(<ClockWrapper defaultTimeZone={defaultTimeZone} defaultCity={cityInfo.city} defaultCountry={cityInfo.country} />);
        });
    }

    getDistance(lat1, lon1, lat2, lon2) {

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

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        return (c * r);
    }
}