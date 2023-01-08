/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Time from "../src/components/time";
import { fireEvent } from '@testing-library/react';
import { timeInputOptions, timezones, keyboardEvents } from './testData';

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

describe('Time component', () => {
    describe('should not be rendered', () => {
        it('if no arguments passed', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<Time />);
            });
    
            // Assert
            const timeComponentRoot = container.querySelector('.time');
            expect(timeComponentRoot).toBeNull();
        });
    
        it('if `date` is passed, but `timezone` isn\'t', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<Time date={new Date()} />);
            });
    
            // Assert
            const timeComponentRoot = container.querySelector('.time');
            expect(timeComponentRoot).toBeNull();
        });
    
        it('if `timezone` is passed, but `date` isn\'t', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<Time timezone={timezones.london} />);
            });
    
            // Assert
            const timeComponentRoot = container.querySelector('.time');
            expect(timeComponentRoot).toBeNull();
        });
    });

    describe('should be rendered', () => {
        it('if `date` and `timezone` both are passed', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<Time date={new Date()}
                    timezone={timezones.london} />);
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
        });

        describe('time input should be valid and `updateTimeDelta` should be called', () => {
            it('if a user doesn\'t change time', () => {
                // Arrange
                const mockUpdateTimeDelta = jest.fn();
        
                // Act
                act(() => {
                    root.render(<Time date={new Date(1961, 4, 12, 12, 0, 0)}
                        timezone={timezones.london}
                        updateTimeDelta={mockUpdateTimeDelta} />);
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

                // switch to editing
                switchMode();
                checkControlsInEditMode(editButtonIcon, mockUpdateTimeDelta);
            
                // no time change

                // switch back
                switchMode();
                checkControlsInDisplayMode(editButtonIcon, mockUpdateTimeDelta, true);

                // switch to editing
                switchMode();
                checkControlsInEditMode(editButtonIcon, mockUpdateTimeDelta);

                // press Esc
                act(() => {
                    fireEvent.keyDown(getTimeEditableInputElement(), keyboardEvents.escape);
                });

                checkControlsInDisplayMode(editButtonIcon, mockUpdateTimeDelta, false);

                // switch to the edit mode, set valid time, and switch back without changing time
                timeInputOptions.forEach(timeInput => {
                    // switch to editing
                    switchMode();
                    checkControlsInEditMode(editButtonIcon, mockUpdateTimeDelta);

                    act(() => {
                        fireEvent.change(getTimeEditableInputElement(), {target: {value: timeInput.input}});
                    });

                    // switch back
                    switchMode();
                    checkControlsInDisplayMode(editButtonIcon, mockUpdateTimeDelta, timeInput.isValid);
                });
            }); 
        });
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

function switchMode() {
    act(() => {
        fireEvent.click(container.querySelector('.time-control-container button'));
    });
}

function checkControlsInEditMode(buttonIcon, callback) {
    expect(getTimeReadonlyElement()).toBeNull();
    expect(getTimeEditableElement()).not.toBeNull();
    expect(buttonIcon.classList.contains('bi-pencil')).toBe(false);
    expect(buttonIcon.classList.contains('bi-check-lg')).toBe(true);
    expect(callback).toHaveBeenCalledTimes(0);
    callback.mockClear();
}

function checkControlsInDisplayMode(buttonIcon, callback, isValid) {
    const timeReadonlyElement = getTimeReadonlyElement();
    expect(timeReadonlyElement).not.toBeNull();
    expect(getTimeEditableElement()).toBeNull();
    expect(buttonIcon.classList.contains('bi-pencil')).toBe(true);
    expect(buttonIcon.classList.contains('bi-check-lg')).toBe(false);
    expect(callback).toHaveBeenCalledTimes(isValid ? 1 : 0);
    callback.mockClear();
}