/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Clock from "../src/components/clock";
import { fireEvent } from '@testing-library/react';

let root = null;
let container = null;

jest.mock("../src/helpers/pexels-helper", () => jest.fn().mockReturnValue(Promise.resolve([])));

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

describe('Clock component: rendering', () => {
    beforeEach(() => {
        jest.mock("../src/components/time", () => () => <div className="time"></div>);
        jest.mock("../src/components/carousel", () => () => <div className="carousel"></div>);
        jest.mock("../src/components/autocomplete-dropdown", () => () => <div className="autocomplete-textbox-component"></div>);
    });
    
    afterEach(() => {    
        jest.restoreAllMocks();
        jest.resetModules();
    });

    it('should not be rendered, if no arguments passed', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<Clock />);
        });

        // Assert
        const clockComponentRoot = container.querySelector('.clock');
        expect(clockComponentRoot).toBeNull();
    });

    it('should be rendered and "Not found" should be shown, if `location` is passed', () => {
        // Arrange

        const location = {
            city: 'Budapest',
            country: 'Hungary',
            iso2: 'HU',
            timezone: 'Europe/Budapest'
        };

        // Act
        act(() => {
            root.render(<Clock location={location} />);
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
    });

    it('should be rendered and "Not found" should be shown, if `location` is passed, `images` is passed, but empty', () => {
        // Arrange

        const location = {
            city: 'Budapest',
            country: 'Hungary',
            iso2: 'HU',
            timezone: 'Europe/Budapest'
        };

        const images = [];

        // Act
        act(() => {
            root.render(<Clock location={location} images={images} />);
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
    });

    it('should be rendered and contain `carousel-container`, if `location` is passed, `images` is passed', () => {
        // Arrange

        const location = {
            city: 'Budapest',
            country: 'Hungary',
            iso2: 'HU',
            timezone: 'Europe/Budapest'
        };

        const images = [{}];

        // Act
        act(() => {
            root.render(<Clock location={location} images={images} />);
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
    });
});

describe('Clock component: intergation with AutocompleteDropDown', () => {
    beforeEach(() => {
        jest.mock("../src/components/time", () => () => <div className="time"></div>);
        jest.mock("../src/components/carousel", () => () => <div className="carousel"></div>);
        jest.mock("../src/helpers/geo-helper", () => ({
            getNearestCity: jest.fn(),
            findCitiesByName: jest.fn().mockReturnValue([{
                label: 'East London',
                diff: 0,
                location: {
                    city: 'East London',
                    country: 'South Africa',
                    iso2: 'ZA',
                    timezone: 'Africa/Johannesburg'
                }
            }])
        }));
    });

    it('should call `onChange` when a city is seelcted in the child AutocompleteDropdown component', () => {
        // Arrange
        const defaultCity = 'New York';
        const defaultLocation = {
            city: defaultCity,
            country: 'United States of America',
            timezone: 'America/New_York',
            iso2: 'US'
        };

        const images = [{}];

        const onChangeMock = jest.fn();

        // Act
        act(() => {
            root.render(<Clock location={defaultLocation} images={images} onChange={onChangeMock} />);
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
        expect(inputElement.value).toBe(defaultCity);

        act(() => {
            fireEvent.change(inputElement, { target: { value: 'London' } });
        });

        const list = container.querySelector('ul');
        expect(list).not.toBeNull();

        // Act: select a city from the list
        act(() => {
            fireEvent.click(list.childNodes[0]);
        });

        // Assert: timezone selected callback
        expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
});