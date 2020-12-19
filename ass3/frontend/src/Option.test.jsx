import { shallow } from 'enzyme';
import React from 'react';
import { Checkbox, TextField, Button } from '@material-ui/core';
import Option from './Option';

describe('Option Component', () => {
  it('has a checkbox', () => {
    const option = shallow(<Option />);
    expect((option.find(Checkbox)).exists()).toEqual(true);
  });

  it('checkbox unchecked by default', () => {
    const option = shallow(<Option />);
    expect(option.find(Checkbox).props().checked).toEqual(false);
  });

  it('has a text field', () => {
    const option = shallow(<Option />);
    expect((option.find(TextField)).exists()).toEqual(true);
  });

  it('text field has placeholder with option number 1 greater than the index', () => {
    const option1 = shallow(<Option index={0} />);
    expect(option1.find(TextField).props().placeholder).toMatch(/Option 1/);
    const option2 = shallow(<Option index={16} />);
    expect(option2.find(TextField).props().placeholder).toMatch(/Option 17/);
  });

  it('text field has label with option number 1 greater than the index', () => {
    const option1 = shallow(<Option index={1} />);
    expect(option1.find(TextField).props().label).toMatch(/Option 2/);
    const option2 = shallow(<Option index={89} />);
    expect(option2.find(TextField).props().label).toMatch(/Option 90/);
  });

  it('text field is empty by default', () => {
    const option = shallow(<Option index={1} />);
    expect(option.find(TextField).props().value).toEqual('');
  });

  it('checkbox is checked when clicked', () => {
    const option = shallow(<Option optionsCallback={jest.fn()} />);
    const checkbox = option.find(Checkbox);
    // verify the default state is unchecked
    expect(checkbox.props().checked).toEqual(false);
    // simulate checkbox onChange event
    checkbox.simulate('change', { target: { checked: true } });
    option.update();
    // verify the checkbox is now checked
    expect(option.find(Checkbox).props().checked).toEqual(true);
    // simulate checkbox onChange event again
    checkbox.simulate('change', { target: { checked: false } });
    option.update();
    // verify the checkbox is now back to unchecked
    expect(option.find(Checkbox).props().checked).toEqual(false);
  });

  it('text field value updates to what a user has typed', () => {
    const text = 'What is the day of the week?';
    const option = shallow(<Option optionsCallback={jest.fn()} />);
    const textField = option.find(TextField);
    // verify the input field is empty by default
    expect(textField.props().value).toEqual('');
    // simulate typing onChange event
    textField.simulate('change', { target: { value: text } });
    option.update();
    // check that the input field has updated to the new text
    expect(option.find(TextField).props().value).toEqual(text);
  });

  describe('optionsCallback is called when checkbox or textfield are changed, with the right parameters', () => {
    it('case: checkbox is checked', () => {
      const optionsCallback = jest.fn();
      const option = shallow(<Option index={1} optionsCallback={optionsCallback} />);
      // simulate checkbox onChange event
      (option.find(Checkbox)).simulate('change', { target: { checked: true } });
      expect(optionsCallback).toBeCalledTimes(1);
      expect(optionsCallback).toHaveBeenCalledWith(1, '', true);
    });

    it('case: textField populated', () => {
      const optionsCallback = jest.fn();
      const text = 'What is the capital of Australia?';
      const option = shallow(<Option index={3} optionsCallback={optionsCallback} />);
      // simulate ext onChange event
      (option.find(TextField)).simulate('change', { target: { value: text } });
      expect(optionsCallback).toBeCalledTimes(1);
      expect(optionsCallback).toHaveBeenCalledWith(3, text, false);
    });

    describe('delete button shows up on the last option, where there are 3 or more options shown', () => {
      it('case: delete button shows up on the last option', () => {
        const option = shallow(<Option index={5} last={6} />);
        expect((option.find(Button)).exists()).toEqual(true);
      });
      it('case: delete button doesn\'t up when it\'s not the last option', () => {
        const option = shallow(<Option index={2} last={6} />);
        expect((option.find(Button)).exists()).toEqual(false);
      });
      it('case: delete button doesn\'t show up when there are less than 2 or less options', () => {
        const option = shallow(<Option index={1} last={2} />);
        expect((option.find(Button)).exists()).toEqual(false);
      });
    });

    it('case: delete button triggers handleDeleteOption, passes the index as parameter', () => {
      const deleteOptionsCallback = jest.fn();
      const option = shallow(
        <Option
          index={5}
          last={6}
          deleteOptionsCallback={deleteOptionsCallback}
        />,
      );
      (option.find(Button)).simulate('click');
      expect(deleteOptionsCallback).toBeCalledTimes(1);
      expect(deleteOptionsCallback).toHaveBeenCalledWith(5);
    });
  });
});
