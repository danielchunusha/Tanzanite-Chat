// Fungua localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// === SIGN UP SYSTEM ===
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // Hakikisha username haijarudiwa
    const exists = users.find(user => user.username === username);
    if (exists) {
      alert("Username tayari inatumika!");
      return;
    }

    // Hifadhi user mpya
    const newUser = { name, username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username); // Login moja kwa moja
    window.location.href = "chat.html"; // Mpeleke kwenye chat
  });
}

// === LOGIN SYSTEM ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem("currentUser", user.username);
      window.location.href = "chat.html"; // Mpeleke kwenye chat
    } else {
      alert("Jina au nenosiri si sahihi!");
    }
  });
}
