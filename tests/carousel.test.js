/**
 * @jest-environment jsdom
 */

import React from "react";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import Carousel from "../src/components/carousel";

let root = null;
let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    root = createRoot(container);
});

afterEach(() => {
    root.unmount();
    container.remove();
    container = null;
});

describe('doesn\'t render anything', () => {
    it('if `images` is undefined', () => {
        act(() => {
            root.render(<Carousel />);
        });
        const carousel = container.querySelector('.carousel');
        expect(carousel).toBeNull();
        const images = container.querySelectorAll('.location-image');
        expect(images).toHaveLength(0);
    });

    it('if `images` is null', () => {
        act(() => {
            root.render(<Carousel images={null} />);
        });
        const carousel = container.querySelector('.carousel');
        expect(carousel).toBeNull();
        const images = container.querySelectorAll('.location-image');
        expect(images).toHaveLength(0);
    });

    it('if `images` is an empty array', () => {
        act(() => {
            root.render(<Carousel images={[]} />);
        });
        const carousel = container.querySelector('.carousel');
        expect(carousel).toBeNull();
        const images = container.querySelectorAll('.location-image');
        expect(images).toHaveLength(0);
    });
});

it('renders images', () => {
    const blobs = ['MQ==', 'Mg==', 'Mw=='];
    act(() => {
        root.render(<Carousel clockId='1' images={blobs} isShakeAnimationRequired='true' />);
    });
    const carousel = container.querySelector('.carousel');
    expect(carousel).not.toBeNull();
    const images = container.querySelectorAll('.location-image');
    expect(images).toHaveLength(3);
    expect(Array.from(images).map(i => i.style.background)).toEqual(blobs.map(b => `url(${b}) no-repeat center`));
});