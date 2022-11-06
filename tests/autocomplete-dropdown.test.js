/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import AutocompleteDropdown from "../src/components/autocomplete-dropdown";
import { fireEvent, waitFor } from '@testing-library/react'

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

describe('AutocompleteDropdown component: rendering', () => {
    it('should be rendered, if `text` and `location` aren\'t passed', () => {
        act(() => {
            root.render(<AutocompleteDropdown />);
        });
        const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
        expect(autocompleteDropdownComponentRoot).not.toBeNull();
        const flagElement = container.querySelector(`.input-group-text span.fi-${location.iso2}`);
        expect(flagElement).toBeNull();
        const textElement = container.querySelector('input[type="text"]');
        expect(textElement).not.toBeNull();
        expect(textElement.value).toBe('');
    });

    it('should be rendered, if `text` and `location` are passed', () => {
        const text = 'New York';
        const location = {
            city: 'New York',
            country: 'United States of America',
            timezone: 'America/New_York',
            iso2: 'us'
        };
        act(() => {
            root.render(<AutocompleteDropdown text={text} location={location} />);
        });
        const autocompleteDropdownComponentRoot = container.querySelector('.autocomplete-textbox-component');
        expect(autocompleteDropdownComponentRoot).not.toBeNull();
        const flagElement = container.querySelector(`.input-group-text span.fi-${location.iso2}`);
        expect(flagElement).not.toBeNull();
        expect(flagElement.title).toBe(location.country);
        const textElement = container.querySelector('input[type="text"]');
        expect(textElement).not.toBeNull();
        expect(textElement.value).toBe(text);
    });
});