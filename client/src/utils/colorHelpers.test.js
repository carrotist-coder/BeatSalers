import { getAverageColor, getTextColor } from "./colorHelpers";

describe('getTextColor', () => {
    test('возвращает чёрный цвет для светлого фона', () => {
        expect(getTextColor(255, 255, 255)).toBe('#000');
        expect(getTextColor(200, 200, 200)).toBe('#000');
    });

    test('возвращает белый цвет для тёмного фона', () => {
        expect(getTextColor(0, 0, 0)).toBe('#fff');
        expect(getTextColor(50, 50, 50)).toBe('#fff');
    });

    test('граничные значения яркости', () => {
        // около 125: серый 118, 118, 118 — белый текст
        expect(getTextColor(118, 118, 118)).toBe('#fff');
        // чуть ярче — чёрный текст
        expect(getTextColor(130, 130, 130)).toBe('#000');
    });
});

describe('getAverageColor', () => {
    let mockCanvas, mockContext;

    beforeEach(() => {
        mockContext = {
            drawImage: jest.fn(),
            getImageData: jest.fn().mockReturnValue({
                data: [
                    // 2 пикселя: (255, 0, 0, 255), (0, 0, 255, 255)
                    255, 0, 0, 255,
                    0, 0, 255, 255
                ]
            })
        };
        mockCanvas = {
            getContext: jest.fn().mockReturnValue(mockContext),
            width: 0,
            height: 0
        };
        document.createElement = jest.fn((el) => {
            if (el === 'canvas') return mockCanvas;
            return document.createElement(el);
        });
    });

    test('правильно вычисляет средний цвет обычных пикселей', () => {
        const fakeImg = {
            naturalWidth: 1,
            naturalHeight: 2
        };

        const avg = getAverageColor(fakeImg, 1);
        expect(avg).toEqual({ r: 127, g: 0, b: 127 });
        expect(mockContext.drawImage).toHaveBeenCalled();
    });

    test('учитывает прозрачные пиксели как белые', () => {
        mockContext.getImageData.mockReturnValue({
            data: [
                // (прозрачный - белый), (обычный черный)
                0, 0, 0, 0,
                0, 0, 0, 255
            ]
        });
        const fakeImg = {
            naturalWidth: 1,
            naturalHeight: 2
        };
        const avg = getAverageColor(fakeImg, 1);
        expect(avg).toEqual({ r: 127, g: 127, b: 127 });
    });
});
