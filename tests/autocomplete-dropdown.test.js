/**
 * @jest-environment jsdom
 */

import React from "react";
import { act } from "react-dom/test-utils";
import AutocompleteDropdown from "../src/components/autocomplete-dropdown";
import { render, fireEvent } from '@testing-library/react';
import i18next from "i18next";
import { when } from 'jest-when';
import { dropdownOptions, cityNames, locations, keyboardEvents } from './testData';

let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
    container.remove();
    container = null;
});

describe('AutocompleteDropdown component', () => {
    describe('should be rendered', () => {
        it('if `text` and `location` are not passed', () => {
            // Arrange

            // Act
            act(() => {
                render(<AutocompleteDropdown />, { container });
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

        describe('should be rerendered', () => {
            it('if `text` changed and `isChangedManually` is false', () => {
                // Arrange
    
                // Act
                act(() => {
                    render(<AutocompleteDropdown />, { container });
                });
        
                // Assert
                const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
                expect(autocompleteDropdownComponentRoot).not.toBeNull();
                const flagElement = container.querySelector(`.input-group-text span.fi-${location.iso2}`);
                expect(flagElement).toBeNull();
                let textElement = container.querySelector('input[type="text"]');
                expect(textElement).not.toBeNull();
                expect(textElement.value).toBe('');
            });
        });

        describe('input tests', () => {
            beforeEach(() => {
                const mockT = jest.spyOn(i18next, 't');
                when(mockT).calledWith('h').mockReturnValue('h');
            });

            describe('`onTimezoneChanged` should be called', () => {
                it('when a timezone is selected by a mouse click', () => {
                    // Arrange
                    const mockGetItems = jest.fn();
                    when(mockGetItems).calledWith(cityNames.london.toUpperCase()).mockReturnValue(dropdownOptions);
    
                    const mockTimezoneChanged = jest.fn();
            
                    // Act
    
                    let rendered;
                    act(() => {
                        rendered = render(<AutocompleteDropdown
                            text={cityNames.budapest}
                            location={locations.budapest.location}
                            getItems={mockGetItems}
                            onTimezoneChanged={mockTimezoneChanged} />, { container });
                    });
            
                    // Assert: label
                    const inputElement = container.querySelector('input[type="text"]');
                    checkLabels(inputElement, locations.budapest.location);
            
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
        
                    checkLabels(inputElement, locations.eastLondon.location);
            
                    // Assert: timezone selected callback
                    expect(mockTimezoneChanged).toHaveBeenNthCalledWith(1, locations.eastLondon.location);
    
                    // the component isn't rerendered, if props changed (since a user has changed the timezone manually)
                    act(() => {
                        rendered.rerender(<AutocompleteDropdown
                            text={cityNames.newYork}
                            location={locations.newYork.location}
                            getItems={mockGetItems}
                            onTimezoneChanged={mockTimezoneChanged} />);
                    });
    
                    checkLabels(inputElement, locations.eastLondon.location);
                });

                ['enter', 'tab'].forEach(key => {
                    it(`when a timezone is selected by pressing the ${key} key`, () => {
                        // Arrange
                        const mockGetItems = jest.fn();
                        when(mockGetItems).calledWith(cityNames.london.toUpperCase()).mockReturnValue(dropdownOptions);
        
                        const mockTimezoneChanged = jest.fn();
                
                        // Act
        
                        let rendered;
                        act(() => {
                            rendered = render(<AutocompleteDropdown
                                text={cityNames.budapest}
                                location={locations.budapest.location}
                                getItems={mockGetItems}
                                onTimezoneChanged={mockTimezoneChanged} />, { container });
                        });
                
                        // Assert: label
                        const inputElement = container.querySelector('input[type="text"]');
                        checkLabels(inputElement, locations.budapest.location);
                
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
                            fireEvent.keyDown(inputElement, keyboardEvents[key]);
                        });
            
                        checkLabels(inputElement, locations.eastLondon.location);
                
                        // Assert: timezone selected callback
                        expect(mockTimezoneChanged).toHaveBeenNthCalledWith(1, locations.eastLondon.location);
        
                        // the component isn't rerendered, if props changed (since a user has changed the timezone manually)
                        act(() => {
                            rendered.rerender(<AutocompleteDropdown
                                text={cityNames.newYork}
                                location={locations.newYork.location}
                                getItems={mockGetItems}
                                onTimezoneChanged={mockTimezoneChanged} />);
                        });
        
                        checkLabels(inputElement, locations.eastLondon.location);
                    });
                });
            });
        
            it('dropdown list should be closed when Escape is pressed', () => {
                // Arrange
                const mockGetItems = jest.fn();
                when(mockGetItems).calledWith(cityNames.london.toUpperCase()).mockReturnValue(dropdownOptions);

                // Act
                act(() => {
                    render(<AutocompleteDropdown
                        text={cityNames.budapest}
                        location={locations.budapest.location}
                        getItems={mockGetItems} />, { container });
                });
        
                // Assert: label
                const inputElement = container.querySelector('input[type="text"]');
                checkLabels(inputElement, locations.budapest.location);
        
                // Act: search a city by name
                act(() => {
                    fireEvent.change(inputElement, { target: { value: cityNames.london } });
                });
    
                expect(inputElement.value).toBe(cityNames.london);
    
                // Assert: dropdown list rendering
                const list = container.querySelector('ul');
                checkCityList(list);
        
                act(() => {
                    fireEvent.keyDown(inputElement, keyboardEvents.escape);
                });
    
                expect(inputElement.value).toBe(cityNames.budapest);
                expect(container.querySelector('ul')).toBeNull();
            });
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