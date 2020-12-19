import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { ProductCard } from './ProductCard';
import bike3 from './images/bike3.jpg';

const item = {
    id: 'glow-in-the-dark-bike',
    image: bike3,
    title: 'Glow in the dark bike',
    price: 50,
    currency: 'AUD',
    descriptions: [
        'Have no more fear during your nightly bike rights, our latest glow-in-the-dark model ensures maximum visibility for maximum safety.',
        'More colours coming soon in 2021.'
    ],
    recommendationRatio: 0.75,
  };

describe('productCard', () => {
    const noop = () => {};

    it('has a title', () => {
        const card = shallow(<ProductCard item={item} />);
        expect((card.find('.card-title')).text()).toBe(item.title);
    });

    it('has an image preview using image input', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.find('.card-image').props()["src"]).toBe(item.image);
    });

    it('has an image with alt description', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.find('.card-image').props()["alt"]).toBe(item.title);
    });

    it('has price displayed to two decimal places', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.text()).toMatch(/50.00/);
    });

    it('has price displayed with discount applied', () => {
        const card = shallow(<ProductCard item={item} discount={0.1} />);
        expect(card.text()).toMatch(/45.00/);
    });

    it('has currency displayed next to price', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.text()).toMatch(/50.00 AUD/);
    });

    it('all descriptions are displayed', () => {
        const card = shallow(<ProductCard item={item} />);
        for (let i of item.descriptions){
            expect(card.text()).toMatch(i);
        }
    });

    it('has Highly recommended by [recommendationRatio]% users', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.text()).toMatch(/Highly recommended by 75% users/);
    });

    it('increments the quantity displayed when + button clicked', () => {
        const card = shallow(<ProductCard item={item} />);
        expect (card.find('#current-quantity').text()).toMatch("0");
        card.find('#plus').simulate('click');
        expect(card.find('#current-quantity').text()).toMatch("1");
    });

    it('decrements the quantity displayed when - button clicked', () => {
        const card = shallow(<ProductCard item={item} />);
        card.find('#plus').simulate('click');
        expect (card.find('#current-quantity').text()).toMatch("1");
        card.find('#minus').simulate('click');
        expect(card.find('#current-quantity').text()).toMatch("0");
    });

    it('trigger onAddToCart with id and quantity when Add to cart clicked', () => {
        const cartItem = {id: 'bike'};
        const addToCart = jest.fn();
        const card = shallow(<ProductCard item={cartItem} onAddToCart={addToCart} />);
        card.find('#plus').simulate('click');
        card.find('#add-to-cart').simulate('click');
        expect(addToCart).toBeCalledTimes(1);
        expect(addToCart).toHaveBeenCalledWith('bike', 1);
    });

    it('- button has aria-label value', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.find('#minus').props()["aria-label"]).toBe('Minus');
    });

    it('+ button has aria-label value', () => {
        const card = shallow(<ProductCard item={item} />);
        expect(card.find('#plus').props()["aria-label"]).toBe('Add');
    });
});
    