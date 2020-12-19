import { createElement, formatTime, getUserInfo } from './helpers.js';
import { api, render } from './main.js';
import { renderProfile } from './profile.js';
import { renderLogin } from './login.js';

// render feed of current user
export function renderFeed(page, num) {
    let feed = createElement('div', null, {id:'feed'});
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(`user/feed?p=${page}&n=${num}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                if (data.posts.length > 0) {    // feed has posts
                    if (data.posts[0].id > window.localStorage.getItem('newestPost')) { 
                        window.localStorage.setItem('newestPost', data.posts[0].id);    // set latest loaded post for push notifications
                    }
                }
                for (let post of data.posts) {
                    let card = createPostObject(post);
                    feed.appendChild(card);
                }
            })
        }
    })
    return feed;
}

// create HTML object for a post
export function createPostObject(post) {
    const container = createElement('div', null, {class: 'post', id: `post-${post.id}`});
    const body = createElement('div', null, {class:'post-body', id:`post-body-${post.id}`})
    const author = createElement('h2', post.meta.author, { class: 'post-author', id: `${post.meta.author}`})
    author.addEventListener('click', viewProfile)
    container.appendChild(author);
    container.appendChild(createElement('p', formatTime(post.meta.published), { class: 'post-time'})); // time
    container.appendChild(createElement('img', null, { src: 'data:image/png;base64,' + post.src, alt: post.meta.description_text, class: 'post-image'}))
    const icons = createElement('div', null, {class: 'post-icon-container'});
    
    const likeBtn = createElement('i', 'thumb_up', {class: postLiked(post) == true ? 'material-icons md-48 post-liked-icon' : 'material-icons md-48 post-icon', id: `likeBtn-${post.id}`});
    likeBtn.addEventListener('click', likePost);
    icons.appendChild(likeBtn);
    const commentBtn = createElement('i', 'comment', {class: 'material-icons md-48 post-icon', id: `commentBtn-${post.id}`});
    commentBtn.addEventListener('click', makeComment);
    icons.appendChild(commentBtn);
    body.appendChild(icons);
    
    body.appendChild(createElement('p', post.meta.description_text, { class: 'post-description', id: `description-${post.id}`})); // description
    const viewLikeBtn = createElement('p', post.meta.likes.length + ' likes', { class: post.meta.likes.length > 0 ? 'post-likes': 'no-post-likes', id: `likes-${post.id}`}); // likes
    body.appendChild(viewLikeBtn);
    if (post.meta.likes.length > 0) {
        viewLikeBtn.addEventListener('click', viewLikes);
    }
    body.appendChild(createElement('p', post.comments.length + ' comments', { class: 'post-comments', id: `comments-${post.id}`})); // comments
    const commentForm = createElement('div', null, {id: `comment-form${post.id}`, class: 'comment-form'});
    commentForm.appendChild(createElement('input', null, {type: 'text', class: 'comment-input', id:`comment-input${post.id}`}));
    const submitComment = createElement('button', "Post comment", {class: 'submit-comment', id: `${post.id}`});
    submitComment.addEventListener('click', postComment);
    commentForm.appendChild(submitComment);
    body.appendChild(commentForm)
    const commentBox = createElement('div', null, {class: 'comments', id: `comments-list-${post.id}`});
    body.appendChild(commentBox);
    if (post.comments.length > 0) {
        commentBox.appendChild(renderComments(post.comments, post.id));
    }
    container.append(body);
    return container;
}

// update post object for live updates
const updatePostObject = (postID) => {
    const post = document.getElementById(postID);
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(`post?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                const comments = document.getElementById(`comments-list-${postID}`);
                // update like button
                if (postLiked(data)) {
                    document.getElementById(`likeBtn-${postID}`).classList.replace('post-icon', 'post-liked-icon');
                } else {
                    document.getElementById(`likeBtn-${postID}`).classList.replace('post-liked-icon', 'post-icon');
                }
                document.getElementById('')
                // update like counter
                const likeCounter =  document.getElementById(`likes-${postID}`);
                likeCounter.innerText = `${data.meta.likes.length} likes`;
                likeCounter.className = data.meta.likes.length > 0 ? 'post-likes': 'no-post-likes';
                if (data.meta.likes.length > 0) {
                    likeCounter.addEventListener('click', viewLikes);
                } else {
                    likeCounter.removeEventListener('click', viewLikes);
                }
                // update comment counter
                document.getElementById(`comments-${postID}`).innerText = `${data.comments.length} comments`;
                // update comment list
                comments.innerHTML = '';
                comments.appendChild(renderComments(data.comments));
                // clear input
                document.getElementById(`comment-input${postID}`).value = '';
            })
        }
    })
}

// show profile of selected user
const viewProfile = (event) => {
    const postAuthor = event.target.id;
    render(renderProfile(null, postAuthor));
}

// toggle input field for making comments
const makeComment = (event) => {
    const postID = event.target.id.split('-')[1];

    const comment = document.getElementById(`comment-form${postID}`);
    comment.style.display == 'block' ? comment.style.display = 'none': comment.style.display = 'block';

}

const postComment = (event) => {
    const postID = event.target.id;
    const commentField = document.getElementById(`comment-input${postID}`);
    const comment = commentField.value;
    const data = {
        comment: comment
    }
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(data)
    }
    api.makeAPIRequest(`post/comment/?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                // UPDATE comment
                updatePostObject(postID);
                
            })
        }
    });
}

const postLiked = (post) => {    
    const id = parseInt(window.localStorage.getItem('id'));
    return post.meta.likes.includes(id);   
}

// like or unlike a selected post
const  likePost = (event) => {
    const postID = event.target.id.split('-')[1];
    let url = `post/like/?id=${postID}`;

    if (event.srcElement.classList.contains('post-liked-icon')) {   // toggle like or unlike
        url = `post/unlike/?id=${postID}`;
    }

    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        },
        method: "PUT"
    }

    api.makeAPIRequest(url, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                // UPDATE like counter
                updatePostObject(postID);
            })
        }
    });
}

// fetch list of users that like the selected post
const viewLikes = (event) => {
    const postID = event.target.id.split('-')[1];
    const options = {
        headers: {
            'Authorization': `Token ${window.localStorage.getItem('token')}`
        }
    }
    
    api.makeAPIRequest(`post/?id=${postID}`, options).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                const likes = renderLikes(data.meta.likes);
                document.getElementById('main').appendChild(likes);
                likes.style.display = "block"; 
            })
        }
    });
}


// render modal showing list of user likes
const renderLikes = (likes) => {
    const modal = createElement('div', null, {class: 'modal'});
    const likeModal = createElement('div', null, {class: 'modal-content'});
    const close = createElement('i', 'clear', {class: 'material-icons close-modal'});
    likeModal.appendChild(close);
    close.addEventListener('click', () => {
        modal.style.display = "none";
    })
    const likesDiv = createElement('div', null, {class: 'user-container'});
    likesDiv.appendChild(createElement('h3', 'Likes', {}));
    for (let user of likes) {
        getUserInfo(user).then(res => {
            likesDiv.appendChild(createElement('p', res.username, {class: 'user-listing'}));
        })   
    }
    likeModal.appendChild(likesDiv);
    modal.appendChild(likeModal);
    return modal;
}

// render comments to append to a post
const renderComments = (comments, id) => {
    const commentList = createElement('ul', null, {class: 'comment-list'});
    for (let c of comments) {
        const comment = createElement('li', null, {class: 'comment'});
        const commentHeader = createElement('div', null, {class: 'comment-header'});
        commentHeader.appendChild(createElement('div', c.author, {class: 'comment-author'}));
        commentHeader.appendChild(createElement('div', formatTime(c.published), {class: 'comment-time'}));
        comment.appendChild(commentHeader);
        comment.appendChild(createElement('div', c.comment, {class: 'comment-content'}));
        commentList.appendChild(comment);
    }
    return commentList;

}
