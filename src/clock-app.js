import { lookupViaCity } from "city-timezones";
import { ClockWrapper } from "./clock-wrapper";
import './i18n';

export default class ClockApp {
    constructor(options) {
        const domContainer = document.querySelector(options.selector);
        const root = ReactDOM.createRoot(domContainer);

        const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const cityInfo = lookupViaCity(defaultTimezone.split('/')[1])[0];

        root.render(<ClockWrapper defaultTimezone={cityInfo.timezone} defaultCity={cityInfo.city} defaultCountry={cityInfo.country} />);
    }
}