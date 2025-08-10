let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Save posts to localStorage
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// Create Post
function createPost() {
    const username = document.getElementById("username").value.trim();
    const content = document.getElementById("postContent").value.trim();

    if (username && content) {
        const newPost = {
            username: username,
            content: content,
            likes: 0,
            comments: [],
            timestamp: new Date().toLocaleString()
        };
        posts.unshift(newPost);
        savePosts();
        renderPosts();
        document.getElementById("postContent").value = "";
    }
}

// Like Button
function toggleLike(index) {
    const post = posts[index];
    post.likes++;
    savePosts();
    renderPosts();
}

// Comment
function promptComment(index) {
    const comment = prompt("Enter your comment:");
    if (comment) {
        posts[index].comments.push(comment);
        savePosts();
        renderPosts();
    }
}

// Search Posts
document.getElementById("searchInput").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    renderPosts(searchText);
});

// Render Posts
function renderPosts(search = "") {
    const container = document.getElementById("posts-container");
    container.innerHTML = "";

    posts
        .filter(post =>
            post.username.toLowerCase().includes(search) ||
            post.content.toLowerCase().includes(search)
        )
        .forEach((post, index) => {
            const postElement = document.createElement("div");
            postElement.className = "post";
            postElement.innerHTML = `
                <div class="post-header">${post.username}</div>
                <div class="post-time">${post.timestamp}</div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="like-btn" onclick="toggleLike(${index})">
                        T (${post.likes})
                    </button>
                    <button class="comment-btn" onclick="promptComment(${index})">
                        Comment (${post.comments.length})
                    </button>
                </div>
            `;
            container.appendChild(postElement);
        });
}

renderPosts();
