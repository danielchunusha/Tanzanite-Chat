document.addEventListener("DOMContentLoaded", loadPosts);

const currentUser = localStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.href = "login.html";
}

document.getElementById("usernameDisplay").textContent = currentUser;

function addPost() {
    const content = document.getElementById("postContent").value.trim();
    if (content === "") return alert("Post cannot be empty!");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    const newPost = {
        id: Date.now(),
        user: currentUser,
        content: content,
        likes: 0,
        comments: []
    };

    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("postContent").value = "";
    loadPosts();
}

function loadPosts() {
    const postList = document.getElementById("postList");
    postList.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <div class="post-header">${post.user}</div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})">👍 Like (${post.likes})</button>
                <button onclick="toggleCommentBox(${post.id})">💬 Comment</button>
            </div>
            <div class="comments">
                ${post.comments.map(c => `<p><b>${c.user}:</b> ${c.text}</p>`).join("")}
            </div>
            <div class="comment-box" id="commentBox-${post.id}" style="display:none;">
                <input type="text" id="commentInput-${post.id}" placeholder="Write a comment...">
                <button onclick="addComment(${post.id})">Post</button>
            </div>
        `;

        postList.appendChild(postElement);
    });
}

function likePost(postId) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();
    }
}

function toggleCommentBox(postId) {
    const box = document.getElementById(`commentBox-${postId}`);
    box.style.display = box.style.display === "none" ? "block" : "none";
}

function addComment(postId) {
    let commentText = document.getElementById(`commentInput-${postId}`).value.trim();
    if (commentText === "") return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({ user: currentUser, text: commentText });
        localStorage.setItem("posts", JSON.stringify(posts));
        loadPosts();
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
