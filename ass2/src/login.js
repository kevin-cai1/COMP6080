import { createElement } from './helpers.js';

// create login form HTML object
export function renderLogin() {
    const login = createElement('div', '', {id: 'login-container', class: 'form-container'});
    const usernameInput = createElement('input', '', {id: 'username', class: 'login-input', type: 'text', required: 'true'});
    const usernameLabel = createElement('label', 'Username ', {for: 'username'});
    const passwordInput = createElement('input', '', {id: 'password', class: 'login-input', type: 'password', required: 'true'});
    const passwordLabel = createElement('label', 'Password ', {for: 'password'});
    const loginBtn = createElement('button', 'Log in', {id: 'loginBtn', class: 'form-btn', name: 'Login'});
    const register = createElement('a', 'Register', {id: 'registerLink', href: '#'});
    login.appendChild(createElement('h3', 'Login', {}));
    login.appendChild(usernameLabel);
    login.appendChild(usernameInput);
    login.appendChild(createElement('br', ''));
    login.appendChild(passwordLabel);
    login.appendChild(passwordInput);
    login.appendChild(loginBtn);
    login.appendChild(register);
    return login;
}


// create create account form HTML object
export function renderSignup() {
    const signupPage = createElement('div', null, {class: 'signup-page'})
    const signup = createElement('div', null, {id: 'signup-container', class: 'form-container'});
    const usernameDiv = createElement('div', null, {class: 'login-field'});
    usernameDiv.appendChild(createElement('label', 'Username ', {class: 'login-label', for: 'username'}));
    usernameDiv.appendChild(createElement('input', null, {id: 'username', class: 'login-input', type: 'text', required: 'true'}));
    
    const passwordDiv = createElement('div', null, {class: 'login-field'});
    passwordDiv.appendChild(createElement('label', 'Password ', {class: 'login-label', for: 'password'}));
    passwordDiv.appendChild(createElement('input', null, {id: 'password', class: 'login-input', type: 'password', required: 'true'}));
    
    const confirmPasswordDiv = createElement('div', null, {class: 'login-field'});
    confirmPasswordDiv.appendChild(createElement('label', 'Confirm Password ', {class: 'login-label', for: 'confirmPassword'}));
    confirmPasswordDiv.appendChild(createElement('input', null, {id: 'confirmPassword', class: 'login-input', type: 'password', required: 'true'}));
    
    const emailDiv = createElement('div', null, {class:'login-field'});
    emailDiv.appendChild(createElement('label', 'Email ', {class: 'login-label', 'for': 'email'}));
    emailDiv.appendChild(createElement('input', null, {id: 'email', class: 'login-input', type: 'text', required: 'true'}));

    const nameDiv = createElement('div', null, {class: 'login-field'});
    nameDiv.appendChild(createElement('label', 'Name ', {class: 'login-label', for: 'name'}));
    nameDiv.appendChild(createElement('input', null, {id: 'name', class: 'login-input', type: 'text', required: 'true'}));

    const signupBtn = createElement('button', 'Sign Up', {id: 'signupBtn', class: 'form-btn', name: 'Sign Up'});
    const signupDiv = createElement('div', null, {class: 'login-field'});
    signupDiv.appendChild(signupBtn);
    signup.appendChild(createElement('h3', 'Create account', {}));
    signup.appendChild(usernameDiv);
    signup.appendChild(passwordDiv);
    signup.appendChild(confirmPasswordDiv);
    signup.appendChild(emailDiv);
    signup.appendChild(nameDiv);
    signupPage.appendChild(signup);

    signupPage.appendChild(signupDiv);
    
    return signupPage;
}

// validate that fields are valid - support for more validation on other fields if necessary
export function validateSignupFields(username, password, passwordConfirm, email, name) {
    let valid = true;
    if (password !== passwordConfirm) {
        valid = false;
    }
    return valid;
}