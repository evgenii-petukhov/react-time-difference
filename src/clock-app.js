import { lookupViaCity } from "city-timezones";
import { ClockCollection } from "./clock-collection";
import './i18n';

export default class ClockApp {
    constructor(options) {
        const domContainer = document.querySelector(options.selector);
        const root = ReactDOM.createRoot(domContainer);

        const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const cityInfo = lookupViaCity(defaultTimezone.split('/')[1])[0];

        root.render(<ClockCollection defaultTimezone={cityInfo.timezone} defaultCity={cityInfo.city} defaultCountry={cityInfo.country} />);
    }
}