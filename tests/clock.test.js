/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Clock from "../src/components/clock";
import { fireEvent } from '@testing-library/react';
import { dropdownOptions, cityNames, locations } from './testData';

let root = null;
let container = null;

jest.mock("../src/components/time", () => () => <div className="time"></div>);
jest.mock("../src/components/carousel", () => () => <div className="carousel"></div>);
jest.mock("../src/helpers/pexels-helper", () => jest.fn().mockReturnValue(Promise.resolve([])));

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

describe('Clock component: rendering', () => {
    beforeEach(() => {
        jest.mock("../src/components/autocomplete-dropdown", () => () => <div className="autocomplete-textbox-component"></div>);
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

        // Act
        act(() => {
            root.render(<Clock location={locations.budapest} />);
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

    it('should be rendered and buttons should call callbacks, if `location` is passed', () => {
        // Arrange
        const id = 1;
        const onAddMock = jest.fn();
        const onRemoveMock = jest.fn();

        // Act
        act(() => {
            root.render(<Clock id={id} location={locations.budapest} onAdd={onAddMock} onRemove={onRemoveMock} />);
        });

        // Assert
        const clockComponentRoot = container.querySelector('.clock');
        expect(clockComponentRoot).not.toBeNull();

        const buttonAdd = clockComponentRoot.querySelector('.btn-add');
        expect(buttonAdd).not.toBeNull();

        act(() => {
            fireEvent.click(buttonAdd);
        });
        expect(onAddMock).toHaveBeenNthCalledWith(1, id);

        const buttonRemove = clockComponentRoot.querySelector('.btn-remove');
        expect(buttonRemove).not.toBeNull();

        act(() => {
            fireEvent.click(buttonRemove);
        });
        expect(onRemoveMock).toHaveBeenNthCalledWith(1, id);
    });

    it('should be rendered and "Not found" should be shown, if `location` is passed, `images` is passed, but empty', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<Clock location={locations.budapest} images={[]} />);
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

    it('should be rendered and contain `carousel-container`, if `location` is passed, `images` is passed', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<Clock location={locations.budapest} images={[{}]} />);
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

describe('Clock component: intergation with AutocompleteDropDown', () => {
    beforeEach(() => {
        jest.mock("../src/helpers/geo-helper", () => ({
            findCitiesByName: mockFindCitiesByName
        }));
    });

    it('should call `onChange` when a city is seelcted in the child AutocompleteDropdown component', () => {
        // Arrange
        const clockId = 1;

        const onChangeMock = jest.fn();

        // Act
        act(() => {
            root.render(<Clock id={clockId} location={locations.budapest} images={[{}]} onChange={onChangeMock} />);
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
        expect(inputElement.value).toBe(cityNames.budapest);

        act(() => {
            fireEvent.change(inputElement, { target: { value: cityNames.london } });
        });

        const list = container.querySelector('ul');
        expect(list).not.toBeNull();

        // Act: select a city from the list
        act(() => {
            fireEvent.click(list.childNodes[0]);
        });

        // Assert: timezone selected callback
        expect(onChangeMock).toHaveBeenNthCalledWith(1, clockId, locations.eastLondon);
    });
});