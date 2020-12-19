import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl, createElement, createAlert, getCurrentUserID, renderFormError, renderAlert } from './helpers.js';
import { renderLogin, renderSignup, validateSignupFields } from './login.js';
import { renderFeed } from './feed.js';
import { renderProfile } from './profile.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

let currentPost = 0;
let oldScrollY = 0;
let newScrollY = 0;

const render = (content) => {
    const main = document.getElementById('main');
    main.innerHTML = '';
    main.appendChild(content);
}

const logout = () => {
    window.localStorage.clear();
    location.reload();
}

const loadHome = () => {
    getCurrentUserID();
    currentPost = 0;        // set number of posts for infinite scroll
    // event listeners for navbar elements
    document.getElementById('profile').addEventListener('click', loadProfile);
    document.getElementById('new-post').addEventListener('click', newPost);
    document.getElementById('search-userBtn').addEventListener('click', followUser);
    document.getElementById('close-post-form').addEventListener('click', closePostModal);
    document.querySelector('input[type="file"]').addEventListener('change', showPreview);
    if (window.localStorage.getItem('username') == null) {  // if not logged in
        hideNavElements();
        // open login page        
        render(renderLogin());
        const register = document.getElementById('registerLink');
        register.addEventListener('click', handleSignup);

        const loginBtn = document.getElementById('loginBtn')
        loginBtn.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;      
            validateLogin(username, password);
        });
    } else {
        showNavElements();
        // open home feed
        const loadedFeed = renderFeed(currentPost, 5)
        render(loadedFeed);
        currentPost += 5;   // update number of posts for infinite scroll
    }
}

const hideNavElements = () => {
    document.getElementById('profile').style.display = "none";
    document.getElementById('new-post').style.display = "none";
    document.getElementById('search-userBtn').style.display = "none";
    document.getElementById('close-post-form').style.display = "none";
    document.getElementById('search-user').style.display = "none";
    document.getElementById('logout').style.display = "none";
}

const showNavElements = () => {
    document.getElementById('profile').style.display = "inline-flex";
    document.getElementById('new-post').style.display = "inline-flex";
    document.getElementById('search-userBtn').style.display = "inline-flex";
    document.getElementById('close-post-form').style.display = "inline-flex";
    document.getElementById('search-user').style.display = "inline-flex";
    document.getElementById('logout').style.display = "inline-flex";
}

// make fetch request to follow user
const followUser = () => {
    const user = document.getElementById('search-user').value;
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        },
        method: "PUT"
    }

    api.makeAPIRequest(`user/follow/?username=${user}`, options).then(res => {
        res.json().then(data => {
            // put alert showing follow status
            if (res.status == 200) {
                document.getElementById('main').prepend(createAlert('info', `Successfully followed '${user}'`));
            } else {
                document.getElementById('main').prepend(createAlert('danger', data.message));
            }
            
        })
        
    });
}

const loadProfile = () => {
    render(renderProfile(null, null));
}

const handleSignup = () => {
    render(renderSignup());
    const signup = document.getElementById('signupBtn');
    signup.addEventListener('click', (event) => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        if (validateSignupFields(username, password, passwordConfirm, email, name)) {
            postSignup(username, password, email, name);
        } else {
            // error
            renderAlert(document.getElementById('main'),'danger', 'Passwords do not match');
        }
    })
}

const postSignup = (username, password, email, name) => {
    const data = {
        username: username,
        password: password,
        email: email,
        name: name
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    api.makeAPIRequest('auth/signup', options).then(res => {
        res.json().then(data => {
            if (res.status == 200) {
                console.log(data);
                window.localStorage.setItem('username', username);
                window.localStorage.setItem('token', data.token);
                loadHome();
            } else {
                // append error to relevant field
                renderAlert(document.getElementById('main'),'danger', data.message);
            }
        })
    })
}

const closePostModal = () => {
    // reset post modal
    document.getElementById('input-image').value = '';
    document.getElementById('post-preview').textContent = '';
    document.getElementById('input-desc').value = '';
    document.getElementById("post-modal").style.display = "none"
    let alert = document.getElementById('alert');
    alert.parentNode.removeChild(alert);
}

const validateLogin = (username, password) => {
    const data = {
        username: username,
        password: password
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    api.makeAPIRequest('auth/login', options).then(res => {
        if (res.status == 200) {
            // set local storage for username and auth token
            res.json().then(data => {
                window.localStorage.setItem('username', username);
                window.localStorage.setItem('token', data.token);
                loadHome();
            });            
        } else {
            renderAlert(document.getElementById('main'), 'danger', 'Incorrect username/password');
        }
    });
}

const newPost = () => {
    const modal = document.getElementById("post-modal");
    modal.style.display = "block"; 
}

const showPreview = () => {
    const [file] = event.target.files;
    console.log(file);
    const dataURL = fileToDataUrl(file);
    console.log(dataURL);
    dataURL
        .then((data) => {
            console.log(data)
            const previewImg = document.getElementById('post-preview');
            while(previewImg.firstChild) {
                previewImg.removeChild(previewImg.firstChild);
            }
            previewImg.appendChild(createElement('img', null, { class: 'previewImg', id:'previewImg', src: data}))
        })
}

// fetch request to POST new content
const sendPost = (description, src) => {
    const data = {
        description_text: description,
        src: src
    }
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }
    console.log(options);
    api.makeAPIRequest('post/', options).then(res => {
        console.log(res);
        if (res.status == 200) {
            res.json().then(data => {                
                // close post modal
                closePostModal();
                document.getElementById('main').prepend(createAlert('success', 'Post uploaded!'));
            })
        }
    });
}

const handleScroll = () => {
    if (main.querySelector("#feed") != null) {
        let currentScroll = document.documentElement.scrollTop + document.documentElement.clientHeight
        newScrollY = window.scrollY;
        if (oldScrollY - newScrollY < 0) {  // scrolling down
            if (currentScroll == document.documentElement.scrollHeight) {   // at the bottom
                main.appendChild(renderFeed(currentPost, 2));
                currentPost += 2;
            }
        }
        oldScrollY = newScrollY;
    }
    
}

const pollServer = () => {
    if (window.localStorage.getItem('token')) {
        pollPosts(0, 1);
    }
    setTimeout(pollServer, 1000);
}

const pollPosts = (page, num) => {
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(`user/feed?p=${page}&n=${num}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                if (data.posts.length > 0) {
                    if (data.posts[0].id > window.localStorage.getItem('newestPost')) { // a newer post exists in feed
                        renderAlert(document.getElementById('main'),'info', 'You have new posts in your feed');
                    } else {    // reloading feed to view new post
                        if (main.querySelector("#feed") != null && main.querySelector(".alert .danger") != null) {
                            main.removeChild(main.querySelector(".alert .danger"));
                        }
                    }
                }
            })
        }
    })
}

let postSubmit = document.getElementById('form-submit');
postSubmit.addEventListener('click', (event) => {
    let alert = document.getElementById('post-form').querySelector("#alert");
    if (document.getElementById('previewImg') == null) {
        // alert for no file selected
        renderFormError(document.getElementById('post-form'), 'danger', 'No file selected');
    } else if (document.getElementById('input-desc').value == "") {
        // alert for no description
        renderFormError(document.getElementById('post-form'), 'danger', 'Description cannot be empty');
    } else {
        const file = document.getElementById('previewImg').src;
        const description = document.getElementById('input-desc').value;
        const src = file.split(',')[1];
        sendPost(description, src);
    }

    
});

window.addEventListener('load', loadHome);
window.addEventListener('scroll', handleScroll);
document.getElementById('home').addEventListener('click', loadHome);
document.getElementById('logout').addEventListener('click', logout);
pollServer();

export { api, render };