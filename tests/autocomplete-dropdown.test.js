/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import AutocompleteDropdown from "../src/components/autocomplete-dropdown";
import { fireEvent } from '@testing-library/react';
import i18next from "i18next";
import { dropdownOptions, cityNames, locations } from './testData';

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

describe('AutocompleteDropdown component', () => {
    describe('should be rendered', () => {
        it('if `text` and `location` aren\'t passed', () => {
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
    
        it('`onTimezoneChanged` should be called when a timezone is selected', () => {
            // Arrange
            const mockGetItems = jest.fn().mockReturnValue(dropdownOptions);
            const mockTimezoneChanged = jest.fn();
            jest.spyOn(i18next, 't').mockReturnValue('h');
    
            // Act
            act(() => {
                root.render(<AutocompleteDropdown
                    text={cityNames.budapest}
                    location={locations.budapest}
                    getItems={mockGetItems}
                    onTimezoneChanged={mockTimezoneChanged} />);
            });
    
            // Assert: label
            const inputElement = container.querySelector('input[type="text"]');
            checkLabels(inputElement, locations.budapest);
    
            // Act: search a city by name
            act(() => {
                fireEvent.change(inputElement, { target: { value: cityNames.london } });
            });

            expect(inputElement.value).toBe(cityNames.london);

            // Assert: dropdown list rendering
            const list = container.querySelector('ul');
            checkCityList(list);
    
            // Act: select a city from the list
            act(() => {
                fireEvent.click(list.childNodes[0]);
            });

            checkLabels(inputElement, locations.eastLondon);
    
            // Assert: timezone selected callback
            expect(mockTimezoneChanged).toHaveBeenNthCalledWith(1, locations.eastLondon);
        });
    
        it('`onTimezoneChanged` should be called when a timezone is selected', () => {
            // Arrange
            const mockGetItems = jest.fn().mockReturnValue(dropdownOptions);
            jest.spyOn(i18next, 't').mockReturnValue('h');
    
            // Act
            act(() => {
                root.render(<AutocompleteDropdown
                    text={cityNames.budapest}
                    location={locations.budapest}
                    getItems={mockGetItems} />);
            });
    
            // Assert: label
            const inputElement = container.querySelector('input[type="text"]');
            checkLabels(inputElement, locations.budapest);
    
            // Act: search a city by name
            act(() => {
                fireEvent.change(inputElement, { target: { value: cityNames.london } });
            });

            expect(inputElement.value).toBe(cityNames.london);

            // Assert: dropdown list rendering
            const list = container.querySelector('ul');
            checkCityList(list);
    
            act(() => {
                fireEvent.keyDown(inputElement, { key: "Escape", code: "Escape", keyCode: 27, charCode: 27 });
            });

            expect(inputElement.value).toBe(cityNames.budapest);
            expect(container.querySelector('ul')).toBeNull();
        });
    });
});

function checkLabels(inputElement, location) {
    const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
    expect(autocompleteDropdownComponentRoot).not.toBeNull();
    const flagElement = container.querySelector(`.input-group-text span.fi-${location.iso2.toLowerCase()}`);
    expect(flagElement).not.toBeNull();
    expect(flagElement.title).toBe(location.country);
    expect(inputElement).not.toBeNull();
    expect(inputElement.value).toBe(location.city);
}

function checkCityList(list) {
    expect(list).not.toBeNull();
    expect(list.childNodes.length).toBe(dropdownOptions.length);
    list.childNodes.forEach((el, index) => {
        const flagElement = el.querySelector('.timezone-flag');
        expect(flagElement).not.toBeNull();
        const spanFlagElement = flagElement.querySelector(`.fi-${dropdownOptions[index].location.iso2.toLowerCase()}`);
        expect(spanFlagElement).not.toBeNull();
        const labelElement = el.querySelector('.timezone-label');
        expect(labelElement).not.toBeNull();
        expect(labelElement.textContent).toBe(dropdownOptions[index].label);
        const diffElement = el.querySelector('.timezone-diff');
        expect(diffElement).not.toBeNull();
        expect(diffElement.textContent).toBe(`${dropdownOptions[index].diff > 0 ? '+' : ''}${dropdownOptions[index].diff}h`);
    });
}