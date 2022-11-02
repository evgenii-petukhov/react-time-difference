/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Time from "../src/components/time";
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

describe('Time component: rendering', () => {
    it('should not be rendered, if no arguments passed', () => {
        act(() => {
            root.render(<Time />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('should not be rendered, if `date` is passed, but `timezone` isn\'t', () => {
        act(() => {
            root.render(<Time date={new Date()} />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('should not be rendered, if `timezone` is passed, but `date` isn\'t', () => {
        act(() => {
            root.render(<Time timezone="Europe/London" />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('should be rendered and `updateTimeDelta` should be called, if `date` and `timezone` both are passed', async () => {
        const mockUpdateTimeDelta = jest.fn();
        act(() => {
            root.render(<Time date={new Date()} timezone="Europe/London" updateTimeDelta={mockUpdateTimeDelta} />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).not.toBeNull();

        expect(getTimeReadonlyElement()).not.toBeNull();
        expect(getTimeEditableElement()).toBeNull();

        const editButtonIcon = container.querySelector('.time-control-container button i');
        expect(editButtonIcon).not.toBeNull();
        expect(editButtonIcon.classList.contains('bi-pencil')).toBe(true);
        expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(false);
    });
});

describe('Time component: input validation', () => {
    it('should be valid, if a user doesn\'t change time', async () => {
        const mockUpdateTimeDelta = jest.fn();
        act(() => {
            root.render(<Time date={new Date(1961, 4, 12, 12, 0, 0)} timezone="Europe/London" updateTimeDelta={mockUpdateTimeDelta} />);
        });

        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).not.toBeNull();

        expect(getTimeReadonlyElement()).not.toBeNull();
        expect(getTimeEditableElement()).toBeNull();

        const editButtonIcon = container.querySelector('.time-control-container button i');
        expect(editButtonIcon).not.toBeNull();
        expect(editButtonIcon.classList.contains('bi-pencil')).toBe(true);
        expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(false);

        const editButton = container.querySelector('.time-control-container button');
        // switch to the edit mode and switch back without changing time
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta);
        // switch to the edit mode, set valid time, and switch back without changing time
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '18:30', true, 23400000);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '23:59', true, 43140000);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '24:00', true, 43200000);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, 'text', false);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, 'te:xt', false);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '2359', false);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '18:60', false);
        await checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '25:00', false);
    });
});

function getTimeEditableElement() {
    return container.querySelector('.time-editable');
}

function getTimeReadonlyElement() {
    return container.querySelector('.time-readonly');
}

function getTimeEditableInputElement() {
    return container.querySelector('.time-editable input[type="text"]');
}

async function checkControls(buttonElement, buttonIcon, callback, timeString = null, isTimeValid = true, expectedDelta = 0) {
    const initialTime = getTimeReadonlyElement().textContent;

    // switch to the edito mode
    fireEvent.click(buttonElement);
    await waitFor(async () => {
        expect(getTimeReadonlyElement()).toBeNull();
        expect(getTimeEditableElement()).not.toBeNull();
        expect(buttonIcon.classList.contains('bi-pencil')).toBe(false);
        expect(buttonIcon.classList.contains('bi-check-lg')).toBe(true);
        expect(callback).toHaveBeenCalledTimes(0);
        callback.mockClear();
    });

    if (timeString) {
        fireEvent.change(getTimeEditableInputElement(), {target: {value: timeString}});
    }

    // switch back
    fireEvent.click(buttonElement);
    await waitFor(() => {
        const timeReadonlyElement = getTimeReadonlyElement();
        expect(timeReadonlyElement).not.toBeNull();
        expect(getTimeEditableElement()).toBeNull();
        expect(buttonIcon.classList.contains('bi-pencil')).toBe(true);
        expect(buttonIcon.classList.contains('bi-check-lg')).toBe(false);
        if (isTimeValid) {
            expect(callback).toHaveBeenNthCalledWith(1, expectedDelta);
        } else {
            expect(callback).toHaveBeenCalledTimes(0);
        }
        
        callback.mockClear();
    });
}