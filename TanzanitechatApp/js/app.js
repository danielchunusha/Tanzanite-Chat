// ===== Tanzanite Chat - app.js (full with follow system) =====

// ---- State (load from localStorage) ----
let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let chats = JSON.parse(localStorage.getItem("chats") || "{}");
let notifications = JSON.parse(localStorage.getItem("notifications") || "[]");

// ---- Elements ----
const authSection = document.getElementById("auth-section");
const forgotSection = document.getElementById("forgot-section");
const dashboard = document.getElementById("dashboard");

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");
const signupQuestion = document.getElementById("signup-question");
const signupAnswer = document.getElementById("signup-answer");

const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const forgotLink = document.getElementById("forgot-link");
const fpUsername = document.getElementById("fp-username");
const fpLoadBtn = document.getElementById("fp-load-btn");
const fpQuestionBlock = document.getElementById("fp-question-block");
const fpQuestion = document.getElementById("fp-question");
const fpAnswer = document.getElementById("fp-answer");
const fpNewPassword = document.getElementById("fp-new-password");
const fpResetBtn = document.getElementById("fp-reset-btn");
const fpBackBtn = document.getElementById("fp-back-btn");

const usernameDisplay = document.getElementById("username-display");
const userAvatar = document.getElementById("user-avatar");
const friendListEl = document.getElementById("friend-list");
const friendSearch = document.getElementById("friend-search");

const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("post-btn");
const postContainer = document.getElementById("post-container");

const notificationCountEl = document.getElementById("notification-count");
const notificationBox = document.getElementById("notification-box");

const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");
const chatWithEl = document.getElementById("chat-with");
const typingIndicator = document.getElementById("typing-indicator");

// selected friend for chat
let selectedFriend = null;
let typingTimeout = null;

// ---- Helpers ----
function saveAll(){
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("chats", JSON.stringify(chats));
  localStorage.setItem("notifications", JSON.stringify(notifications));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

function escapeHtml(text){
  if (!text) return "";
  return text.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[m]);
}

// --------- FOLLOW SYSTEM (ensure arrays & functions) ---------
function ensureFollowArrays() {
  users = users.map(u => {
    if (!Array.isArray(u.followers)) u.followers = [];
    if (!Array.isArray(u.following)) u.following = [];
    return u;
  });
  saveAll();
}

function isFollowing(a, b) {
  const userA = users.find(u => u.username === a);
  return userA ? userA.following.includes(b) : false;
}

function isMutualFollow(a, b) {
  return isFollowing(a, b) && isFollowing(b, a);
}

function followUser(targetUsername) {
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  if (currentUser.username === targetUsername) return alert("Huwezi kufollow mwenyewe.");

  const targetIndex = users.findIndex(u => u.username === targetUsername);
  const meIndex = users.findIndex(u => u.username === currentUser.username);
  if (targetIndex === -1 || meIndex === -1) return alert("Mtumiaji hayupo.");

  if (!users[meIndex].following.includes(targetUsername)) {
    users[meIndex].following.push(targetUsername);
  }
  if (!users[targetIndex].followers.includes(currentUser.username)) {
    users[targetIndex].followers.push(currentUser.username);
  }

  currentUser = users[meIndex];
  saveAll();
  renderFriendList();
  addNotification(`${currentUser.username} ameifuata ${targetUsername}`);
}

function unfollowUser(targetUsername) {
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  if (currentUser.username === targetUsername) return alert("Huwezi kufanya hili.");

  const targetIndex = users.findIndex(u => u.username === targetUsername);
  const meIndex = users.findIndex(u => u.username === currentUser.username);
  if (targetIndex === -1 || meIndex === -1) return alert("Mtumiaji hayupo.");

  users[meIndex].following = users[meIndex].following.filter(x => x !== targetUsername);
  users[targetIndex].followers = users[targetIndex].followers.filter(x => x !== currentUser.username);

  currentUser = users[meIndex];
  saveAll();
  renderFriendList();
  addNotification(`${currentUser.username} amefuta follow kwa ${targetUsername}`);
}

// ---- AUTH: signup/login/logout ----
signupBtn?.addEventListener("click", () => {
  const u = signupUsername.value.trim();
  const p = signupPassword.value.trim();
  const q = signupQuestion.value.trim();
  const a = signupAnswer.value.trim();
  if (!u || !p || !q || !a) return alert("Jaza kila sehemu ya signup.");
  if (users.find(x=>x.username === u)) return alert("Username tayari ipo.");
  const newUser = { username: u, password: p, question: q, answer: a, avatar: "images/default-profile.png", followers: [], following: [] };
  users.push(newUser);
  saveAll();
  alert("Umesajiliwa. Tafadhali ingia sasa.");
  signupUsername.value = signupPassword.value = signupQuestion.value = signupAnswer.value = "";
});

loginBtn?.addEventListener("click", () => {
  const u = loginUsername.value.trim();
  const p = loginPassword.value.trim();
  const user = users.find(x => x.username === u && x.password === p);
  if (!user) return alert("Jina au nenosiri si sahihi.");
  currentUser = user;
  saveAll();
  openDashboard();
});

logoutBtn?.addEventListener("click", () => {
  currentUser = null;
  saveAll();
  dashboard.style.display = "none";
  authSection.style.display = "block";
});

// ---- Forgot password flow ----
forgotLink?.addEventListener("click", () => {
  authSection.style.display = "none";
  forgotSection.style.display = "block";
});

fpLoadBtn?.addEventListener("click", () => {
  const u = fpUsername.value.trim();
  if (!u) return alert("Weka jina la mtumiaji.");
  const user = users.find(x=>x.username === u);
  if (!user) return alert("Mtumiaji huyu hayupo.");
  fpQuestion.textContent = user.question;
  fpQuestionBlock.style.display = "block";
});

fpResetBtn?.addEventListener("click", () => {
  const u = fpUsername.value.trim();
  const answer = fpAnswer.value.trim();
  const np = fpNewPassword.value.trim();
  if (!u || !answer || !np) return alert("Jaza kila sehemu.");
  const idx = users.findIndex(x=>x.username === u);
  if (idx === -1) return alert("Mtumiaji hayupo.");
  if (users[idx].answer !== answer) return alert("Jibu si sahihi.");
  users[idx].password = np;
  saveAll();
  alert("Nenosiri limebadilishwa. Tafadhali ingia.");
  // go back to login
  fpUsername.value = fpAnswer.value = fpNewPassword.value = "";
  fpQuestionBlock.style.display = "none";
  forgotSection.style.display = "none";
  authSection.style.display = "block";
});

fpBackBtn?.addEventListener("click", () => {
  fpUsername.value = fpAnswer.value = fpNewPassword.value = "";
  fpQuestionBlock.style.display = "none";
  forgotSection.style.display = "none";
  authSection.style.display = "block";
});

// ---- INIT UI ----
function init(){
  // ensure follow arrays exist and load UI
  ensureFollowArrays();
  renderFriendList();
  renderPosts();
  renderNotifications();
  if (currentUser) openDashboard();
}
init();

// ---- OPEN DASHBOARD ----
function openDashboard(){
  authSection.style.display = "none";
  forgotSection.style.display = "none";
  dashboard.style.display = "block";
  usernameDisplay.textContent = currentUser.username;
  userAvatar.src = currentUser.avatar || "images/default-profile.png";
  renderFriendList();
  renderPosts();
  renderNotifications();
}

// ---- FRIENDS (render with follow/unfollow + chat open) ----
function renderFriendList(){
  if (!friendListEl) return;
  friendListEl.innerHTML = "";

  // ensure arrays up to date
  ensureFollowArrays();

  // show all users except current user
  const list = users.filter(u => !currentUser || u.username !== currentUser.username);

  list.forEach(u => {
    const li = document.createElement("li");
    li.className = "friend-item";

    // left: name + follower count
    const leftWrap = document.createElement("div");
    leftWrap.style.display = "flex";
    leftWrap.style.alignItems = "center";
    leftWrap.style.gap = "8px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = u.username;
    nameSpan.style.fontWeight = "600";

    const infoSpan = document.createElement("span");
    infoSpan.style.marginLeft = "8px";
    infoSpan.style.fontSize = "12px";
    infoSpan.style.color = "#cbd5e1";
    infoSpan.textContent = `Followers: ${u.followers ? u.followers.length : 0}`;

    leftWrap.appendChild(nameSpan);
    leftWrap.appendChild(infoSpan);

    // follow/unfollow button
    const btn = document.createElement("button");
    btn.className = "follow-btn";
    const amIFollowing = currentUser ? (users.find(x=>x.username===currentUser.username).following.includes(u.username)) : false;

    if (amIFollowing) {
      btn.textContent = "Following";
      btn.classList.add("active");
      btn.onclick = () => { unfollowUser(u.username); };
    } else {
      btn.textContent = "Follow";
      btn.onclick = () => { followUser(u.username); };
    }

    // chat open button (only enabled if mutual follow)
    const chatBtn = document.createElement("button");
    chatBtn.className = "follow-btn";
    chatBtn.style.marginLeft = "8px";
    chatBtn.textContent = "Chat";
    chatBtn.onclick = () => {
      if (!currentUser) return alert("Tafadhali ingia kwanza.");
      if (!isMutualFollow(currentUser.username, u.username)) {
        return alert("Chat inapatikana wakati mna-follow kila mmoja (mutual). Tafadhali follow ili kuanza chat.");
      }
      selectFriend(u.username);
    };

    li.appendChild(leftWrap);
    const rightWrap = document.createElement("div");
    rightWrap.style.display = "flex";
    rightWrap.style.gap = "8px";
    rightWrap.appendChild(btn);
    rightWrap.appendChild(chatBtn);
    li.appendChild(rightWrap);

    friendListEl.appendChild(li);
  });
}

function selectFriend(username) {
  selectedFriend = username;
  document.querySelectorAll("#friend-list li").forEach(n=>n.classList.remove("active"));
  // highlight the li
  [...document.querySelectorAll("#friend-list li")].forEach(li=>{
    if (li.querySelector("span")?.textContent === username) li.classList.add("active");
  });

  chatWithEl.textContent = "Chat na " + username;
  renderChat(username);
}

// search friends
friendSearch?.addEventListener("input", ()=> {
  const q = friendSearch.value.toLowerCase();
  document.querySelectorAll("#friend-list li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});

// ---- POSTS ----
postBtn?.addEventListener("click", ()=> {
  const txt = postInput.value.trim();
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  if (!txt) return;
  const newPost = {
    id: Date.now(),
    author: currentUser.username,
    content: txt,
    time: new Date().toLocaleString(),
    likes: [],
    comments: []
  };
  posts.unshift(newPost);
  saveAll();
  postInput.value = "";
  renderPosts();
  addNotification(`${currentUser.username} ameweka post mpya`);
});

function renderPosts(){
  if (!postContainer) return;
  postContainer.innerHTML = "";
  posts.forEach(p=>{
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${escapeHtml(p.author)}</h4>
      <div class="meta">${p.time}</div>
      <p>${escapeHtml(p.content)}</p>
      <div class="actions">
        <button onclick="toggleLike(${p.id})">${p.likes.includes(currentUser?.username) ? '💛' : '🤍'} ${p.likes.length}</button>
        <button onclick="promptComment(${p.id})">💬 ${p.comments.length}</button>
      </div>
      <div class="comments">${p.comments.map(c=>`<div><b>${escapeHtml(c.user)}:</b> ${escapeHtml(c.text)}</div>`).join("")}</div>
    `;
    postContainer.appendChild(div);
  });
}

function toggleLike(postId){
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  const p = posts.find(x=>x.id===postId);
  if (!p) return;
  const i = p.likes.indexOf(currentUser.username);
  if (i === -1) p.likes.push(currentUser.username);
  else p.likes.splice(i,1);
  saveAll();
  renderPosts();
  addNotification(`${currentUser.username} amelifanya like kwenye post`);
}

function promptComment(postId){
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  const txt = prompt("Andika comment:");
  if (!txt) return;
  const p = posts.find(x=>x.id===postId);
  if (!p) return;
  p.comments.push({ user: currentUser.username, text: txt });
  saveAll();
  renderPosts();
  addNotification(`${currentUser.username} amecomment kwenye post`);
}

// ---- NOTIFICATIONS ----
function addNotification(message){
  const n = { id: Date.now(), message, time: new Date().toLocaleString(), seen:false };
  notifications.unshift(n);
  saveAll();
  renderNotifications();
}

function renderNotifications(){
  const unseen = notifications.filter(n=>!n.seen).length;
  if (unseen > 0) {
    notificationCountEl.style.display = "inline";
    notificationCountEl.textContent = unseen;
  } else {
    notificationCountEl.style.display = "none";
  }

  notificationBox.onclick = ()=> {
    if (notifications.length === 0) return alert("Hakuna arifa");
    alert(notifications.map(n=>`${n.time}\n${n.message}`).join("\n\n"));
    notifications = notifications.map(n=>({...n, seen:true}));
    saveAll();
    renderNotifications();
  };
}

// ---- CHAT (local demo) ----
function chatKey(a,b){ return [a,b].sort().join("__"); }

function renderChat(friendUsername){
  if (!friendUsername) return;
  chatContainer.innerHTML = "";
  const convo = chats[chatKey(currentUser.username, friendUsername)] || [];
  convo.forEach(m=>{
    const d = document.createElement("div");
    d.className = "chat-msg " + (m.from === currentUser.username ? "me" : "them");
    d.innerHTML = `<div><b>${escapeHtml(m.from)}:</b> ${escapeHtml(m.text)}</div><div class="meta">${m.time}</div>`;
    chatContainer.appendChild(d);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

chatSendBtn?.addEventListener("click", sendChat);
chatInput?.addEventListener("keypress", (e)=> {
  if (e.key === "Enter") sendChat();
  // typing indicator (local demo)
  showTypingIndicatorTemporarily();
});

function sendChat(){
  if (!currentUser) return alert("Tafadhali ingia kwanza.");
  if (!selectedFriend) return alert("Chagua rafiki kuanza chat.");

  // NEW: require mutual follow
  if (!isMutualFollow(currentUser.username, selectedFriend)) {
    return alert("Chat inapatikana tu wakati mna-follow kila mmoja. Tafadhali muanze kufollow ili mnaweza kuzungumza.");
  }

  const text = chatInput.value.trim();
  if (!text) return;
  const key = chatKey(currentUser.username, selectedFriend);
  if (!chats[key]) chats[key] = [];
  const msg = { id: Date.now(), from: currentUser.username, to: selectedFriend, text, time: new Date().toLocaleString() };
  chats[key].push(msg);
  saveAll();
  chatInput.value = "";
  renderChat(selectedFriend);
  addNotification(`Ujumbe mpya kutoka ${currentUser.username} kwa ${selectedFriend}`);
}

function showTypingIndicatorTemporarily(){
  typingIndicator.style.display = "block";
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(()=> typingIndicator.style.display = "none", 1500);
}
