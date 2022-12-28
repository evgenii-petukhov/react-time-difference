/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Clock from "./clock";
import { fireEvent } from '@testing-library/react'

let root = null;
let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    root = createRoot(container);

    jest.mock("./time", () => () => (<div className="time"></div>));
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
        expect(clockComponentRoot).not.toBeNull();
    });

    /*it('should not be rendered, if `date` is passed, but `timezone` isn\'t', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<Time date={new Date()} />);
        });

        // Assert
        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('should not be rendered, if `timezone` is passed, but `date` isn\'t', () => {
        // Arrange

        // Act
        act(() => {
            root.render(<Time timezone="Europe/London" />);
        });

        // Assert
        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).toBeNull();
    });

    it('should be rendered and `updateTimeDelta` should be called, if `date` and `timezone` both are passed', async () => {
        // Arrange
        const mockUpdateTimeDelta = jest.fn();

        // Act
        act(() => {
            root.render(<Time date={new Date()} timezone="Europe/London" updateTimeDelta={mockUpdateTimeDelta} />);
        });

        // Assert
        const timeComponentRoot = container.querySelector('.time');
        expect(timeComponentRoot).not.toBeNull();

        expect(getTimeReadonlyElement()).not.toBeNull();
        expect(getTimeEditableElement()).toBeNull();

        const editButtonIcon = container.querySelector('.time-control-container button i');
        expect(editButtonIcon).not.toBeNull();
        expect(editButtonIcon.classList.contains('bi-pencil')).toBe(true);
        expect(editButtonIcon.classList.contains('bi-check-lg')).toBe(false);
    });*/
});

/*describe('Time component: input validation', () => {
    it('should be valid, if a user doesn\'t change time', async () => {
        // Arrange
        const mockUpdateTimeDelta = jest.fn();

        // Act
        act(() => {
            root.render(<Time date={new Date(1961, 4, 12, 12, 0, 0)} timezone="Europe/London" updateTimeDelta={mockUpdateTimeDelta} />);
        });

        // Assert
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
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta);
        // switch to the edit mode, set valid time, and switch back without changing time
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '18:30', true, 23400000);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '23:59', true, 43140000);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '24:00', true, 43200000);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, 'text', false);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, 'te:xt', false);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '2359', false);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '18:60', false);
        checkControls(editButton, editButtonIcon, mockUpdateTimeDelta, '25:00', false);
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

function checkControls(buttonElement, buttonIcon, callback, timeString = null, isTimeValid = true, expectedDelta = 0) {
    // switch to editing
    act(() => {
        fireEvent.click(buttonElement);
    });
    
    expect(getTimeReadonlyElement()).toBeNull();
    expect(getTimeEditableElement()).not.toBeNull();
    expect(buttonIcon.classList.contains('bi-pencil')).toBe(false);
    expect(buttonIcon.classList.contains('bi-check-lg')).toBe(true);
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();

    if (timeString) {
        act(() => {
            fireEvent.change(getTimeEditableInputElement(), {target: {value: timeString}});
        });
    }

    // switch back
    act(() => {
        fireEvent.click(buttonElement);
    });
    
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
}
*/