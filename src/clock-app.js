import { lookupViaCity } from "city-timezones";
import ClockCollection from "./components/clock-collection";
import './config/i18n';

export default class ClockApp {
    constructor(options) {
        const domContainer = document.querySelector(options.selector);
        const root = ReactDOM.createRoot(domContainer);

        const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const cityInfo = defaultTimezone.includes('UTC') || !defaultTimezone.includes('/') ? {
            city: 'New York',
            country: 'United States of America',
            timezone: 'America/New_York',
            iso2: 'US'
        } : lookupViaCity(defaultTimezone.split('/')[1])[0];

        root.render(<ClockCollection defaultTimezone={cityInfo.timezone} 
            defaultCity={cityInfo.city} 
            defaultCountry={cityInfo.country}
            defaultIso2={cityInfo.iso2} />);
    }
}