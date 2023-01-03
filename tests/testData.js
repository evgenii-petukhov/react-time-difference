const cityNames = {
    budapest: 'Budapest', 
    eastLondon: 'East London',
    london: 'London'
};

const locations = {
    budapest: {
        city: cityNames.budapest,
        country: 'Hungary',
        iso2: 'HU',
        timezone: 'Europe/Budapest'
    },
    eastLondon: {
        city: cityNames.eastLondon,
        country: 'South Africa',
        iso2: 'ZA',
        timezone: 'Africa/Johannesburg'
    }
};

const dropdownOptions = [{
    label: cityNames.eastLondon,
    diff: 0,
    location: locations.eastLondon
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

export { dropdownOptions, locations, cityNames };