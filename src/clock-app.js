import { ClockWrapper } from "./clock-wrapper";

export default class ClockApp {
    constructor(options) {
        const domContainer = document.querySelector(options.selector);
        const root = ReactDOM.createRoot(domContainer);
        root.render(React.createElement(ClockWrapper));
    }
}