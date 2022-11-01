/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Time from "../src/components/time";
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

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

describe('doesn\'t render the Time component', () => {
    it('if no arguments passed', () => {
        act(() => {
            root.render(<Time />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('if `date` is passed, but `timezone` isn\'t', () => {
        act(() => {
            root.render(<Time date={new Date()} />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('if `timezone` is passed, but `date` isn\'t', () => {
        act(() => {
            root.render(<Time timezone="Europe/London" />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });
});

describe('renders the Time component and calls the `updateTimeDelta` when time is set', () => {
    it('if `date` and `timezone` both are passed', async () => {
        const mockUpdateTimeDelta = jest.fn();
        act(() => {
            root.render(<Time date={new Date()} timezone="Europe/London" updateTimeDelta={mockUpdateTimeDelta} />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).not.toBeNull();

        const readonlyTimeContainer = container.querySelector('.time-readonly');
        expect(readonlyTimeContainer).not.toBeNull();

        const editableTimeContainer = container.querySelector('.time-editable');
        expect(editableTimeContainer).toBeNull();

        const editButtonIcon = container.querySelector('.time-control-container button i');
        expect(editButtonIcon).not.toBeNull();
        expect(editButtonIcon.classList.contains('bi-pencil')).toBe(true);
        expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(false);

        const editButton = container.querySelector('.time-control-container button');
        fireEvent.click(editButton);
        await waitFor(async () => {
            expect(editButtonIcon.classList.contains('bi-pencil')).toBe(false);
            expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(true);
            expect(mockUpdateTimeDelta).toHaveBeenCalledTimes(0);

            fireEvent.click(editButton);
            await waitFor(() => {
                expect(editButtonIcon.classList.contains('bi-pencil')).toBe(true);
                expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(false);
                expect(mockUpdateTimeDelta).toHaveBeenCalledTimes(1);
            });
        });
    });
});