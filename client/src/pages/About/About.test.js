import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';
import { ABOUT_CARDS_DATA } from '../../utils/consts';
import '@testing-library/jest-dom';

jest.mock('../../utils/consts', () => ({
    ABOUT_CARDS_DATA: [
        { imageUrl: 'image1.jpg', title: 'Title 1', text: 'Text 1' },
        { imageUrl: 'image2.jpg', title: 'Title 2', text: 'Text 2' },
        { imageUrl: 'image3.jpg', title: 'Title 3', text: 'Text 3' },
    ],
}));

describe('About component', () => {
    test('рендерит заголовки', () => {
        render(<About />);
        expect(screen.getByText('О колледже')).toBeInTheDocument();
        expect(screen.getByText(/Брестский музыкальный колледж/i)).toBeInTheDocument();
    });

    test('рендерит правильное число карточек', () => {
        render(<About />);
        const cards = screen.getAllByRole('img');
        expect(cards).toHaveLength(ABOUT_CARDS_DATA.length);
    });

    test('правильно рендерит контент', () => {
        render(<About />);
        ABOUT_CARDS_DATA.forEach(card => {
            expect(screen.getByText(card.title)).toBeInTheDocument();
            expect(screen.getByText(card.text)).toBeInTheDocument();
        });
    });
});
