import { api, render } from './main.js';
import { createElement, getUserInfo, createAlert, renderFormError } from './helpers.js';
import { createPostObject } from './feed.js';

export function renderProfile(id, username) {
    // get profile details for given id
    let ownProfile = false;
    let url = '';
    if (username) {
        url = `user/?username=${username}`
    } else {
        if (id == null) {
            ownProfile = true;
            url = 'user/';
        } else {
            url = `user/?id=${id}`
        }
    }

    const profile = createElement('div', null, {class: 'profile-page'});
    const info = createElement('div', null, {class: 'profile-header'});
    const profileInfo = createElement('div', null, {class: 'profile-info'});
    const profileFollowers = createElement('div', null, {class: 'profile-followers'});
    const posts = createElement('div', null, {class: 'image-grid'});

    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(url, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                profileInfo.appendChild(createElement('div', data.username, {class: 'profile-username'}));
                profileInfo.appendChild(createElement('div', data.name, {class: 'profile-name'}));
                profileInfo.appendChild(createElement('div', data.email, {class: 'profile-email'}));

                window.localStorage.setItem('name', data.name);
                window.localStorage.setItem('email', data.email);

                if (ownProfile) {
                    const updateIcon = createElement('i', 'edit', {class: 'material-icons profile-update', id: `${data.id}`});
                    updateIcon.addEventListener('click', updateProfile);
                    profileInfo.appendChild(updateIcon);
                }
                
                const following = createElement('div', `Following: ${data.following.length}`, {class: ownProfile ? 'profile-following-link':'profile-following'})
                if (ownProfile) {
                    following.addEventListener('click', () => viewFollowers(data.following));
                }
                profileFollowers.appendChild(following);
                profileFollowers.appendChild(createElement('div', `Followers: ${data.followed_num}`, {class:'profile-follows'}));
                // load user's posts
                for (let i = data.posts.length; i--;) {
                    posts.appendChild(createProfilePost(data.posts[i], ownProfile));
                }
               
                if (data.posts.length == 0) {
                    posts.appendChild(createElement('div', 'No posts', {class: 'post post-body'}))
                }
            })
        }
    });
    info.appendChild(profileInfo);
    info.appendChild(profileFollowers);
    profile.appendChild(info);
    profile.appendChild(posts);
    return profile
}

// show profile update modal
const updateProfile = () => {
    const modal = renderProfileUpdate()
    document.getElementById('main').appendChild(modal);
    modal.style.display = "block";

}

// render profile update modal
const renderProfileUpdate = () => {
    const modal = createElement('div', null, {class: 'modal', id:'updateModal'});
    const followModal = createElement('div', null, {class: 'modal-content'});
    const close = createElement('i', 'clear', {class: 'material-icons close-modal'});
    followModal.appendChild(close);
    close.addEventListener('click', () => {
        modal.style.display = "none";
    })
    const userDiv = createElement('div', null, {id: 'profile-edit', class: 'profile-edit'});
    const nameField = createElement('div', null, {class: 'profile-update-div'});
    nameField.appendChild(createElement('label', 'Name', {class: 'edit-profile-label'}));
    nameField.appendChild(createElement('input', null, {class: 'edit-profile-field', id: 'edit-profile-name', value: window.localStorage.getItem('name')}));

    const emailField = createElement('div', null, {class: 'profile-update-div'});
    emailField.appendChild(createElement('label', 'Email', {class: 'edit-profile-label'}));
    emailField.appendChild(createElement('input', null, {class: 'edit-profile-field', id: 'edit-profile-email', value: window.localStorage.getItem('email')}));

    const passwordField = createElement('div', null, {class: 'profile-update-div'});
    passwordField.appendChild(createElement('label', 'Password', {class: 'edit-profile-label'}));
    passwordField.appendChild(createElement('input', null, {class: 'edit-profile-field', id: 'edit-profile-password', type: 'password'}));
    
    userDiv.appendChild(createElement('h3', 'Update profile', {}));
    userDiv.appendChild(nameField);
    userDiv.appendChild(emailField);
    userDiv.appendChild(passwordField);
    const submitEdit = createElement('button', 'Submit', {class: 'edit-profile-submit'});
    submitEdit.addEventListener('click', sendDetails);
    userDiv.appendChild(submitEdit);
    
    followModal.appendChild(userDiv);
    modal.appendChild(followModal);
    return modal;
}

// send update profile form details
const sendDetails = () => {
    const name = document.getElementById('edit-profile-name').value;
    const email = document.getElementById('edit-profile-email').value;
    const password = document.getElementById('edit-profile-password').value;
    if (password == "" || name == "" || email == "") {
        renderFormError(document.getElementById('profile-edit'),'danger', 'Fields cannot be empty');
    } else {
        const data = {
            email: email,
            name: name,
            password: password
        }

        const options = {
            headers: {
                'Authorization': `Token ${window.localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(data)
        }
        
        api.makeAPIRequest('user/', options).then(res => {
            if (res.status == 200) {
                res.json().then(data => {
                    // put alert showing success
                    document.getElementById('main').prepend(createAlert('info', 'User details successfully updated'))
                    // close and clear modal
                    document.getElementById('updateModal').style.display = "none";
                    // update local storage values
                    window.localStorage.setItem('name', name);
                    window.localStorage.setItem('email', email);
                })
            } else {
                renderFormError(document.getElementById('profile-edit'),'danger', 'Fields cannot be empty');
            }
        });
    }
}

// create post card for profile view
const createProfilePost = (postID, ownProfile) => {
    const container = createElement('div', null, {class: 'grid-item'})

    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(`post/?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                const post = createPostObject(data);
                if (ownProfile) {
                    const postSettings = createElement('div', null, {class: 'post-settings'});
                    const deleteIcon = createElement('i', 'delete', {class: 'material-icons deletePost', id: `${data.id}`});
                    deleteIcon.addEventListener('click', deletePost)
                    const updateIcon = createElement('i', 'edit', {class: 'material-icons updatePost', id: `${data.id}`});
                    updateIcon.addEventListener('click', toggleUpdatePost);
                    postSettings.appendChild(deleteIcon);
                    postSettings.appendChild(updateIcon);
                    post.appendChild(postSettings);
                }
                container.appendChild(post);
            })
        }
    });
    return container;
}

// toggle input field for updating post description
const toggleUpdatePost = (event) => {
    const postID = event.target.id;
    const element = document.getElementById(`description-${postID}`);
    
    let input = createElement('div', null, {id: `description-${postID}`});
    if (element.tagName.toLowerCase() == 'div') {  // description is input field
        const value = document.getElementById(`description-field-${postID}`);
        input = createElement('p', value.value, { class: 'post-description', id: `description-${postID}`})
    } else {                            // description is <p>
        const textInput = createElement('input', element.textContent, {value: element.textContent, type: 'text', id: `description-field-${postID}`});
        const submit = createElement('button', 'Submit', {id: `${postID}`});
        submit.addEventListener('click', updatePost);
        input.appendChild(textInput);
        input.appendChild(submit);
    }
    
    const container = document.getElementById(`post-body-${postID}`);
    console.log(container);
    container.replaceChild(input, element);
}


// fetch request to send post update
const updatePost = (event) => {
    const postID = event.target.id;
    const desc = document.getElementById(`description-field-${postID}`).value;
    const data = {
        description_text: desc
    }

    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(data)
    }
    
    api.makeAPIRequest(`post/?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                document.getElementById('main').prepend(createAlert('info', `Post updated successfully`))
            })
        }
    });    
}

const deletePost = (event) => {
    const postID = event.target.id;
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        },
        method: "DELETE"
    }

    api.makeAPIRequest(`post/?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                document.getElementById('main').prepend(createAlert('danger', `Post deleted`))
            })
        }
    });

}

// show follower list modal
const viewFollowers = (following) => {
    const followers = renderFollowers(following);
    document.getElementById('main').appendChild(followers);
    followers.style.display = "block";
}

// render follower list modal
const renderFollowers = (followers) => {
    const modal = createElement('div', null, {class: 'modal'});
    const followModal = createElement('div', null, {class: 'modal-content'});
    const close = createElement('i', 'clear', {class: 'material-icons close-modal'});
    followModal.appendChild(close);
    close.addEventListener('click', () => {
        modal.style.display = "none";
    })
    const userDiv = createElement('div', null, {class: 'user-container'});
    for (let user of followers) {
        getUserInfo(user).then(res => {
            const userListing = createElement('div', null, {class: 'user-listing'});
            userListing.appendChild(createElement('p', res.username, {class: 'followed-user'}));
            const unfollow = createElement('button', 'unfollow', {class:'user-unfollow', id: `${res.username}`});
            unfollow.addEventListener('click', unfollowUser);
            userListing.appendChild(unfollow);
            userDiv.appendChild(userListing);
        })   
    }
    followModal.appendChild(userDiv);
    modal.appendChild(followModal);
    return modal;
}

const unfollowUser = (event) => {
    const user = event.target.id;

    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        },
        method: "PUT"
    }

    api.makeAPIRequest(`user/unfollow/?username=${user}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                // put alert showing unfollow success
                document.getElementById('main').prepend(createAlert('info', `Successfully unfollowed '${user}'`));
                
            })
        }
    });
}