/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Clock from "../src/components/clock";
import { fireEvent } from '@testing-library/react'

let root = null;
let container = null;

jest.mock("../src/components/time", () => () => <div className="time"></div>);
jest.mock("../src/components/carousel", () => () => <div className="carousel"></div>);
jest.mock("../src/components/autocomplete-dropdown", () => () => <div className="autocomplete-textbox-component"></div>);

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