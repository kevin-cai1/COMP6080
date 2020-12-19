import { shallow } from 'enzyme';
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import LoginForm from './LoginForm';

describe('Login Component', () => {
  it('has a title that says Login', () => {
    const login = shallow(<LoginForm />);
    expect(login.find('.form-title').text()).toEqual('Login');
  });

  it('has an Text Field labelled email', () => {
    const login = shallow(<LoginForm />);
    expect((login.find(TextField)).findWhere((node) => node.props().label === 'Email').exists()).toEqual(true);
  });

  it('has an Text Field labelled password', () => {
    const login = shallow(<LoginForm />);
    expect((login.find(TextField)).findWhere((node) => node.props().label === 'Password').exists()).toEqual(true);
  });

  it('has a submit button', () => {
    const login = shallow(<LoginForm />);
    expect(login.find(Button).text()).toEqual('Submit');
  });

  it('email field is empty by default', () => {
    const login = shallow(<LoginForm />);
    const emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
    expect(emailField.props().value).toEqual('');
  });

  it('password field is empty by default', () => {
    const login = shallow(<LoginForm />);
    const passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
    expect(passwordField.props().value).toEqual('');
  });

  it('password field has password as the type prop', () => {
    const login = shallow(<LoginForm />);
    const passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
    expect(passwordField.props().type).toEqual('password');
  });

  it('entering text in the email field updates the email value', () => {
    const emailInput = 'testing@mail.com';
    const login = shallow(<LoginForm />);
    let emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
    // verify the email field is empty by default
    expect(emailField.props().value).toEqual('');
    // simulate typing onChange event
    emailField.simulate('change', { target: { value: emailInput } });
    login.update();
    emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
    // check that the email field has updated to the new text
    expect(emailField.props().value).toEqual(emailInput);
  });

  it('entering text in the password field updates the password value', () => {
    const passwordInput = 'secret123';
    const login = shallow(<LoginForm />);
    let passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
    // verify the password field is empty by default
    expect(passwordField.props().value).toEqual('');
    // simulate typing onChange event
    passwordField.simulate('change', { target: { value: passwordInput } });
    login.update();
    passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
    // check that the password field has updated to the new text
    expect(passwordField.props().value).toEqual(passwordInput);
  });

  describe('form submit will pass email and password to onLoginSubmit function', () => {
    it('case: no email and password', () => {
      const onLoginSubmit = jest.fn();
      const responseBody = '{"email":"","password":""}';
      const login = shallow(<LoginForm onLoginSubmit={onLoginSubmit} />);
      const appForm = login.find('.App-form');
      // simulate login form submit
      appForm.simulate('submit', { preventDefault: () => {} });
      expect(onLoginSubmit).toHaveBeenCalledTimes(1);
      expect(onLoginSubmit).toHaveBeenCalledWith(responseBody);
    });

    it('case: yes email and no password', () => {
      const email = 'testing@email.com';
      const onLoginSubmit = jest.fn();
      const responseBody = `{"email":"${email}","password":""}`;
      const login = shallow(<LoginForm onLoginSubmit={onLoginSubmit} />);
      // simulate entering email
      const emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      emailField.simulate('change', { target: { value: email } });
      login.update();
      const appForm = login.find('.App-form');
      // simulate login form submit
      appForm.simulate('submit', { preventDefault: () => {} });
      expect(onLoginSubmit).toHaveBeenCalledTimes(1);
      expect(onLoginSubmit).toHaveBeenCalledWith(responseBody);
    });

    it('case: no email and yes password', () => {
      const password = 'secret123';
      const onLoginSubmit = jest.fn();
      const responseBody = `{"email":"","password":"${password}"}`;
      const login = shallow(<LoginForm onLoginSubmit={onLoginSubmit} />);
      // simulate entering password
      const passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      passwordField.simulate('change', { target: { value: password } });
      login.update();
      const appForm = login.find('.App-form');
      // simulate login form submit
      appForm.simulate('submit', { preventDefault: () => {} });
      expect(onLoginSubmit).toHaveBeenCalledTimes(1);
      expect(onLoginSubmit).toHaveBeenCalledWith(responseBody);
    });

    it('case: email and password entered', () => {
      const email = 'testing@email.com';
      const password = 'secret123';
      const onLoginSubmit = jest.fn();
      const responseBody = `{"email":"${email}","password":"${password}"}`;
      const login = shallow(<LoginForm onLoginSubmit={onLoginSubmit} />);
      // simulate entering email
      const emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      emailField.simulate('change', { target: { value: email } });
      login.update();
      // simulate entering password
      const passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      passwordField.simulate('change', { target: { value: password } });
      login.update();
      const appForm = login.find('.App-form');
      // simulate login form submit
      appForm.simulate('submit', { preventDefault: () => {} });
      expect(onLoginSubmit).toHaveBeenCalledTimes(1);
      expect(onLoginSubmit).toHaveBeenCalledWith(responseBody);
    });
  });

  describe('after form is submitted, email and password fields are cleared', () => {
    it('case: no email and password before submit', () => {
      const login = shallow(<LoginForm onLoginSubmit={jest.fn()} />);
      // simulate login form submit
      (login.find('.App-form')).simulate('submit', { preventDefault: () => {} });
      login.update();
      // check that email and password is empty
      const emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      const passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      expect(emailField.props().value).toEqual('');
      expect(passwordField.props().value).toEqual('');
    });

    it('case: email and password populated before submit', () => {
      const email = 'testing@email.com';
      const password = 'secret123';
      const login = shallow(<LoginForm onLoginSubmit={jest.fn()} />);
      // simulate entering email
      let emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      emailField.simulate('change', { target: { value: email } });
      // simulate entering password
      let passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      passwordField.simulate('change', { target: { value: password } });
      login.update();
      emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      // verify email and password are populated
      expect(emailField.props().value).toEqual(email);
      expect(passwordField.props().value).toEqual(password);
      // simulate login form submit
      (login.find('.App-form')).simulate('submit', { preventDefault: () => {} });
      login.update();
      // expect email and password field to now be empty
      emailField = (login.find(TextField)).findWhere((node) => node.props().label === 'Email');
      passwordField = (login.find(TextField)).findWhere((node) => node.props().label === 'Password');
      expect(emailField.props().value).toEqual('');
      expect(passwordField.props().value).toEqual('');
    });
  });

  describe('login error alert shown when error prop is true', () => {
    it('error prop is true', () => {
      const error = true;
      const login = shallow(<LoginForm error={error} />);
      expect((login.find(Alert)).exists()).toEqual(true);
    });

    it('error prop is false', () => {
      const error = false;
      const login = shallow(<LoginForm error={error} />);
      expect((login.find(Alert)).exists()).toEqual(false);
    });
  });

  it('error prop has a severity of error', () => {
    const error = true;
    const login = shallow(<LoginForm error={error} />);
    expect(login.find(Alert).props().severity).toEqual('error');
  });

  it('error prop has a meaningful message', () => {
    const error = true;
    const login = shallow(<LoginForm error={error} />);
    expect(login.find(Alert).text()).toMatch(/Please enter a valid username and password/);
  });
});
