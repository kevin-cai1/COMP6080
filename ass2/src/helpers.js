import { api } from './main.js';

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// create html object
export function createElement(tag, data, options = {}) {
    const element = document.createElement(tag);
    if (data) {
        element.textContent = data;
    }

    for (let field in options) {
        element.setAttribute(field, options[field]);
    }
    return element;
}

// format UTC time to user-friendly format
export function formatTime(time) {
    let d = new Date(0);
    d.setUTCSeconds(time);
    let month = d.toLocaleString('default', { month: 'long'});
    let t = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})
    let year = d.getFullYear();
    let date = d.getDate();
    let formattedTime = `${t} ${date} ${month} ${year}`;
    return formattedTime;
}

// fetch all user data for given id
export function getUserInfo(id) {
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    return api.makeAPIRequest(`user/?id=${id}`, options)
    .then(res => res.json())
    .then(data => {
        return data;
    })
}

// create alert object
export function createAlert(type, message) {
    const alertType = `alert ${type}`;
    const alert = createElement('div', null, {class: alertType, id: 'alert'})
    const close = createElement('i', 'close', {class: 'material-icons alert-close'});
    close.addEventListener('click', () => {
       alert.style.opacity = "0";
       setTimeout(function() { alert.parentNode.removeChild(alert)}, 600); 
    });
    alert.appendChild(close);
    alert.appendChild(createElement('p', message, {class: 'alert-message'}));
    return alert;
}

// get user id of the current logged in user from token
export function getCurrentUserID() {
    if (window.localStorage.getItem('token')) {
        const options = {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('token')}`
            }
        }
        
        api.makeAPIRequest('user/', options).then(res => {
            if (res.status == 200) {
                res.json().then(data => {
                    window.localStorage.setItem('id', data.id);
                })
            }
        })
    }
}


export function renderFormError(parent, alertType, message) {
    let alert = parent.querySelector("#alert"); // check if an alert already exists
    if (alert != null) {
        parent.replaceChild(createAlert(alertType, message), alert);
    } else {
        parent.appendChild(createAlert(alertType, message));
    }
}

export function renderAlert(parent, alertType, message) {
    let alert = parent.querySelector("#alert"); // check if an alert already exists
    if (alert != null) {
        parent.replaceChild(createAlert(alertType, message), alert);
    } else {
        parent.prepend(createAlert(alertType, message));
    }
}