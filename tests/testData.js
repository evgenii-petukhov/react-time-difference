const cities = {
    budapest: {
        location: {
            city: 'Budapest',
            country: 'Hungary',
            iso2: 'HU',
            timezone: 'Europe/Budapest'
        },
        lat: 47.4979,
        lng: 19.0402
    },
    eastLondon: {
        location: {
            city: 'East London',
            country: 'South Africa',
            iso2: 'ZA',
            timezone: 'Africa/Johannesburg'
        },
        lat: -33.0198,
        lng: 27.9039
    },
    newYork : {
        location: {
            city: 'New York',
            country: 'United States of America',
            iso2: 'US',
            timezone: 'America/New_York'
        },
        lat: 40.7128,
        lng: -74.0060
    },
    london: {
        location: {
            city: 'London',
            country: 'United Kingdom',
            iso2: 'GB',
            timezone: 'Europe/London'
        }
    }
};

const dropdownOptions = [{
    label: 'East London',
    diff: 0,
    location: {
        city: 'East London',
        country: 'South Africa',
        iso2: 'ZA',
        timezone: 'Africa/Johannesburg'
    }
}, {
    label: 'London',
    diff: -7,
    location: {
        city: 'London',
        country: 'Canada',
        iso2: 'CA',
        timezone: 'America/Toronto'
    }
}, {
    label: 'London',
    diff: -2,
    location: {
        city: 'London',
        country: 'United Kingdom',
        iso2: 'GB',
        timezone: 'Europe/London'
    }
}, {
    label: 'London',
    diff: -7,
    location: {
        city: 'London',
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

const imageCacheResults = {
    argentina: ['images/argentina.jpeg'],
    australia: ['images/australia.jpeg'],
    austria: ['images/austria.jpeg'],
    belgium: ['images/belgium.jpeg'],
    brazil: ['images/brazil.jpeg'],
    canada: ['images/canada.jpeg'],
    chile: ['images/chile.jpeg'],
    china: ['images/china.jpeg'],
    colombia: ['images/colombia.jpeg'],
    'czech republic': ['images/czech republic.jpeg'],
    estonia: ['images/estonia.jpeg'],
    finland: ['images/finland.jpeg'],
    france: ['images/france.jpeg'],
    germany: ['images/germany.jpeg'],
    greece: ['images/greece.jpeg'],
    hungary: [
        'images/hungary.jpeg',
        'images/hungary-2.jpeg',
        'images/hungary-3.jpeg'
    ],
    india: ['images/india.jpeg'],
    italy: ['images/italy.jpeg'],
    japan: ['images/japan.jpeg'],
    latvia: ['images/latvia.jpeg'],
    lithuania: ['images/lithuania.jpeg'],
    luxembourg: ['images/luxembourg.jpeg'],
    malta: ['images/malta.jpeg'],
    norway: ['images/norway.jpeg'],
    poland: ['images/poland.jpeg'],
    portugal: ['images/portugal.jpeg'],
    romania: ['images/romania.jpeg'],
    russia: ['images/russia.jpeg'],
    serbia: [
        'images/serbia.jpeg',
        'images/serbia-2.jpeg',
        'images/serbia-3.jpeg'
    ],
    'south korea': ['images/south korea.jpeg'],
    spain: ['images/spain.jpeg'],
    switzerland: ['images/switzerland.jpeg'],
    turkey: ['images/turkey.jpeg'],
    ukraine: ['images/ukraine.jpeg'],
    'united kingdom': [
        'images/united kingdom.jpeg',
        'images/united kingdom-2.jpeg',
        'images/united kingdom-3.jpeg',
        'images/united kingdom-4.jpeg',
        'images/united kingdom-5.jpeg',
        'images/united kingdom-6.jpeg',
        'images/united kingdom-7.jpeg'
    ],
    'united states of america': ['images/united states of america.jpeg'],
    uruguay: ['images/uruguay.jpeg'],
    vietnam: ['images/vietnam.jpeg'],
};

export {
    dropdownOptions,
    cities,
    timeInputOptions,
    timezones,
    keyboardEvents,
    imageCacheResults
};