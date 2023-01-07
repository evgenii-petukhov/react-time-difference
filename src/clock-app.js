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
        
        const location = {
            timezone: cityInfo.timezone,
            city: cityInfo.city,
            country: cityInfo.country,
            iso2: cityInfo.iso2
        };

        root.render(<ClockCollection defaultLocation={location} />);
    }
}