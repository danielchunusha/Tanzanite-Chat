document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  // Check if account already exists
  let users = JSON.parse(localStorage.getItem("tanzanite_users")) || [];
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    alert("Account with this email already exists.");
    return;
  }

  // Save user data
  users.push({ username, email, password });
  localStorage.setItem("tanzanite_users", JSON.stringify(users));
  localStorage.setItem("tanzanite_logged_in_user", JSON.stringify({ username, email }));

  // Redirect to chat page directly
  window.location.href = "chat.html";
});
