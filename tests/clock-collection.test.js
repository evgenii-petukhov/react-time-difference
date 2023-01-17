/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import ClockCollection from "../src/components/clock-collection";

let root = null;
let container = null;

jest.mock("../src/components/clock", () => () => <div className="clock"></div>);

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

describe('ClockCollection component', () => {
    describe('should not be rendered', () => {
        it('if no arguments passed', () => {
            // Arrange
    
            // Act
            act(() => {
                root.render(<ClockCollection />);
            });
    
            // Assert
            const clockComponentRoot = container.querySelector('.clock-collection');
            expect(clockComponentRoot).toBeNull();
        });
    });
});