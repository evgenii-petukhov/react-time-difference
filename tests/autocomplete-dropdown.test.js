/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import AutocompleteDropdown from "../src/components/autocomplete-dropdown";
import { fireEvent, waitFor } from '@testing-library/react';
import i18next from "i18next";

let root = null;
let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    root = createRoot(container);
});

afterEach(() => {
    act(() => {
        root.unmount();
    });
    container.remove();
    container = null;
});

const options = [{
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

describe('AutocompleteDropdown component: rendering', () => {
    it('should be rendered, if `text` and `location` aren\'t passed', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<AutocompleteDropdown />);
        });

        // Assert
        const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
        expect(autocompleteDropdownComponentRoot).not.toBeNull();
        const flagElement = container.querySelector(`.input-group-text span.fi-${location.iso2}`);
        expect(flagElement).toBeNull();
        const textElement = container.querySelector('input[type="text"]');
        expect(textElement).not.toBeNull();
        expect(textElement.value).toBe('');
    });

    it('should be rendered and `onTimezoneChanged` should be called when a timezone is selected', async () => {
        // Arrange
        const defaultCity = 'New York';
        const defaultLocation = {
            city: defaultCity,
            country: 'United States of America',
            timezone: 'America/New_York',
            iso2: 'US'
        };
        const mockGetItems = jest.fn().mockReturnValue(options);
        const mockTimezoneChanged = jest.fn();
        jest.spyOn(i18next, 't').mockReturnValue('h');

        // Act
        act(() => {
            root.render(<AutocompleteDropdown text={defaultCity} location={defaultLocation} getItems={mockGetItems} onTimezoneChanged={mockTimezoneChanged} />);
        });

        // Assert: label
        const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
        expect(autocompleteDropdownComponentRoot).not.toBeNull();
        const flagElement = container.querySelector(`.input-group-text span.fi-${defaultLocation.iso2.toLowerCase()}`);
        expect(flagElement).not.toBeNull();
        expect(flagElement.title).toBe(defaultLocation.country);
        const inputElement = container.querySelector('input[type="text"]');
        expect(inputElement).not.toBeNull();
        expect(inputElement.value).toBe(defaultCity);

        // Assert: dropdown list rendering
        fireEvent.change(inputElement, { target: { value: 'London' } });
        const list = container.querySelector('ul');
        expect(list).not.toBeNull();
        expect(list.childNodes.length).toBe(options.length);
        list.childNodes.forEach((el, index) => {
            const flagElement = el.querySelector('.timezone-flag');
            expect(flagElement).not.toBeNull();
            const spanFlagElement = flagElement.querySelector(`.fi-${options[index].location.iso2.toLowerCase()}`);
            expect(spanFlagElement).not.toBeNull();
            const labelElement = el.querySelector('.timezone-label');
            expect(labelElement).not.toBeNull();
            expect(labelElement.textContent).toBe(options[index].label);
            const diffElement = el.querySelector('.timezone-diff');
            expect(diffElement).not.toBeNull();
            expect(diffElement.textContent).toBe(`${options[index].diff > 0 ? '+' : ''}${options[index].diff}h`);
        });

        // Assert: timezone selected callback
        fireEvent.click(list.childNodes[0]);
        expect(mockTimezoneChanged).toHaveBeenCalledTimes(1);
    });
});