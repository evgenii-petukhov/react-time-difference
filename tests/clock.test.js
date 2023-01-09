/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Clock from "../src/components/clock";
import { fireEvent } from '@testing-library/react';
import { dropdownOptions, cities } from './testData';

let root = null;
let container = null;

jest.mock("../src/components/time", () => () => <div className="time"></div>);
jest.mock("../src/components/carousel", () => () => <div className="carousel"></div>);
jest.mock("../src/helpers/pexels-helper", () => jest.fn().mockReturnValue(new Promise(() => {})));

// https://lukerogerson.medium.com/two-ways-to-fix-the-jest-test-error-the-module-factory-of-jest-mock-is-not-allowed-to-bf022b5175dd
const mockFindCitiesByName = jest.fn().mockReturnValue(dropdownOptions);

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

describe('Clock component', () => {
    beforeEach(() => {
        jest.mock("../src/components/autocomplete-dropdown", () => () => <div className="autocomplete-textbox-component"></div>);
    });

    describe('should not be rendered', () => {
        it('if no arguments passed', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<Clock />);
            });
    
            // Assert
            const clockComponentRoot = container.querySelector('.clock');
            expect(clockComponentRoot).toBeNull();
        });
    });

    describe('should be rendered', () => {
        describe('should show "Not found"', () => {
            it('if `location` is passed', () => {
                // Arrange
                const id = 1;
                const onAddMock = jest.fn();
                const onRemoveMock = jest.fn();

                // Act
                act(() => {
                    root.render(<Clock id={id}
                        location={cities.budapest.location}
                        onAdd={onAddMock}
                        onRemove={onRemoveMock} />);
                });
        
                // Assert
                const clockComponentRoot = container.querySelector('.clock');
                expect(clockComponentRoot).not.toBeNull();
                const loading = clockComponentRoot.querySelector('.loading');
                expect(loading).toBeNull();
                const carousel = clockComponentRoot.querySelector('.carousel-container');
                expect(carousel).toBeNull();
                const notFound = clockComponentRoot.querySelector('.not-found');
                expect(notFound).not.toBeNull();
                const buttonAdd = clockComponentRoot.querySelector('.btn-add');
                expect(buttonAdd).not.toBeNull();
                const buttonRemove = clockComponentRoot.querySelector('.btn-remove');
                expect(buttonRemove).not.toBeNull();
        
                act(() => {
                    fireEvent.click(buttonAdd);
                });
                expect(onAddMock).toHaveBeenNthCalledWith(1, id);
        
                act(() => {
                    fireEvent.click(buttonRemove);
                });
                expect(onRemoveMock).toHaveBeenNthCalledWith(1, id);
            });

            it('if `location` and `images` are passed, but `images` is empty', () => {
                // Arrange
        
                // Act
                act(() => {
                    root.render(<Clock location={cities.budapest.location} images={[]} />);
                });
        
                // Assert
                const clockComponentRoot = container.querySelector('.clock');
                expect(clockComponentRoot).not.toBeNull();
                const loading = clockComponentRoot.querySelector('.loading');
                expect(loading).toBeNull();
                const carousel = clockComponentRoot.querySelector('.carousel-container');
                expect(carousel).toBeNull();
                const notFound = clockComponentRoot.querySelector('.not-found');
                expect(notFound).not.toBeNull();
                const buttonAdd = clockComponentRoot.querySelector('.btn-add');
                expect(buttonAdd).not.toBeNull();
                const buttonRemove = clockComponentRoot.querySelector('.btn-remove');
                expect(buttonRemove).not.toBeNull();
            });
        });

        describe('should contain `carousel-container`', () => {
            it('if `location` and `images` are passed', () => {
                // Arrange
        
                // Act
                act(() => {
                    root.render(<Clock location={cities.budapest.location} images={[{}]} />);
                });
        
                // Assert
                const clockComponentRoot = container.querySelector('.clock');
                expect(clockComponentRoot).not.toBeNull();
                const dropdown = clockComponentRoot.querySelector('.autocomplete-textbox-component');
                expect(dropdown).not.toBeNull();
                const loading = clockComponentRoot.querySelector('.loading');
                expect(loading).toBeNull();
                const carouselContainer = clockComponentRoot.querySelector('.carousel-container');
                expect(carouselContainer).not.toBeNull();
                const carousel = carouselContainer.querySelector('.carousel');
                expect(carousel).not.toBeNull();
                const notFound = clockComponentRoot.querySelector('.not-found');
                expect(notFound).toBeNull();
                const buttonAdd = clockComponentRoot.querySelector('.btn-add');
                expect(buttonAdd).not.toBeNull();
                const buttonRemove = clockComponentRoot.querySelector('.btn-remove');
                expect(buttonRemove).not.toBeNull();
            });
        });
    });

    describe('intergation with AutocompleteDropDown', () => {
        describe('should call `onChange`', () => {
            beforeEach(() => {
                jest.mock("../src/helpers/geo-helper", () => ({
                    findCitiesByName: mockFindCitiesByName
                }));
            });
        
            it('if a city is selected in the nested AutocompleteDropdown component', () => {
                // Arrange
                const clockId = 1;
        
                const onChangeMock = jest.fn();
        
                // Act
                act(() => {
                    root.render(<Clock id={clockId}
                        location={cities.budapest.location}
                        images={[{}]}
                        onChange={onChangeMock} />);
                });
        
                // Assert
                const clockComponentRoot = container.querySelector('.clock');
                expect(clockComponentRoot).not.toBeNull();
                const dropdown = clockComponentRoot.querySelector('.autocomplete-textbox-component');
                expect(dropdown).not.toBeNull();
                const loading = clockComponentRoot.querySelector('.loading');
                expect(loading).toBeNull();
                const carousel = clockComponentRoot.querySelector('.carousel-container');
                expect(carousel).not.toBeNull();
                const notFound = clockComponentRoot.querySelector('.not-found');
                expect(notFound).toBeNull();
                const inputElement = container.querySelector('input[type="text"]');
                expect(inputElement).not.toBeNull();
                expect(inputElement.value).toBe(cities.budapest.location.city);
        
                act(() => {
                    fireEvent.change(inputElement, { target: { value: cities.london.location.city } });
                });
        
                const list = container.querySelector('ul');
                expect(list).not.toBeNull();
        
                // Act: select a city from the list
                act(() => {
                    fireEvent.click(list.childNodes[0]);
                });
        
                // Assert: timezone selected callback
                expect(onChangeMock).toHaveBeenNthCalledWith(1, clockId, cities.eastLondon.location);
            });
        });
    });
});