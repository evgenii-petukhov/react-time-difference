const cityNames = {
    budapest: 'Budapest', 
    eastLondon: 'East London',
    london: 'London',
    newYork: 'New York'
};

const locations = {
    budapest: {
        location: {
            city: cityNames.budapest,
            country: 'Hungary',
            iso2: 'HU',
            timezone: 'Europe/Budapest'
        },
        lat: 47.4979,
        lng: 19.0402
    },
    eastLondon: {
        location: {
            city: cityNames.eastLondon,
            country: 'South Africa',
            iso2: 'ZA',
            timezone: 'Africa/Johannesburg'
        },
        lat: -33.0198,
        lng: 27.9039
    },
    newYork : {
        location: {
            city: cityNames.newYork,
            country: 'United States of America',
            iso2: 'US',
            timezone: 'America/New_York'
        },
        lat: 40.7128,
        lng: -74.0060
    }
};

const dropdownOptions = [{
    label: cityNames.eastLondon,
    diff: 0,
    location: locations.eastLondon.location
}, {
    label: cityNames.london,
    diff: -7,
    location: {
        city: cityNames.london,
        country: 'Canada',
        iso2: 'CA',
        timezone: 'America/Toronto'
    }
}, {
    label: cityNames.london,
    diff: -2,
    location: {
        city: cityNames.london,
        country: 'United Kingdom',
        iso2: 'GB',
        timezone: 'Europe/London'
    }
}, {
    label: cityNames.london,
    diff: -7,
    location: {
        city: cityNames.london,
        country: 'United States of America',
        iso2: 'US',
        timezone: 'America/New_York'
    }
}, {
    label: 'Londonderry',
    diff: -2,
    location: {
        city: 'Londonderry',
        country: 'United Kingdom',
        iso2: 'GB',
        timezone: 'Europe/London'
    }
}, {
    label: 'New London',
    diff: -7,
    location: {
        city: 'Londonderry',
        country: 'United States of America',
        iso2: 'US',
        timezone: 'America/New_York'
    }
}];

const timeInputOptions = [{
        input: '18:30', 
        isValid: true, 
        delta: 23400000
    }, {
        input: '23:59', 
        isValid: true, 
        delta: 43140000
    }, {
        input: '24:00', 
        isValid: true, 
        delta: 43200000
    }, {
        input: 'text', 
        isValid: false,
        delta: 0
    }, {
        input: '2359', 
        isValid: false,
        delta: 0
    }, {
        input: '18:60', 
        isValid: false,
        delta: 0
    }, {
        input: '25:00', 
        isValid: false,
        delta: 0
    }
];

const timezones = {
    london: 'Europe/London'
};

const keyboardEvents = {
    escape: {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27
    },
    enter: {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        charCode: 13
    },
    tab: {
        key: "Tab",
        code: "Tab",
        keyCode: 9,
        charCode: 9
    }
};

export {
    dropdownOptions,
    locations,
    cityNames,
    timeInputOptions,
    timezones,
    keyboardEvents
};