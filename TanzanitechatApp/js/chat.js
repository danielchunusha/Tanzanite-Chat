// Pata jina la mtumiaji kutoka localStorage
const currentUser = localStorage.getItem("currentUser");
const currentUserDisplay = document.getElementById("currentUser");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatBox = document.getElementById("chatBox");

// Onyesha jina la mtumiaji
if (currentUser) {
  currentUserDisplay.textContent = currentUser;
} else {
  // Kama hakuna user alie-login, rudisha kwenye login
  window.location.href = "login.html";
}

// Pakua ujumbe wote kutoka localStorage
let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

// Onyesha ujumbe kwenye chatBox
function displayMessages() {
  chatBox.innerHTML = "";
  messages.forEach(msg => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${msg.sender}: ${msg.text}`;
    messageDiv.style.padding = "5px 10px";
    messageDiv.style.marginBottom = "5px";
    messageDiv.style.backgroundColor = msg.sender === currentUser ? "#2563eb" : "#1e40af";
    messageDiv.style.color = "white";
    messageDiv.style.borderRadius = "8px";
    messageDiv.style.maxWidth = "70%";
    messageDiv.style.alignSelf = msg.sender === currentUser ? "flex-end" : "flex-start";
    messageDiv.style.marginLeft = msg.sender === currentUser ? "auto" : "0";
    chatBox.appendChild(messageDiv);
  });

  // Scroll mwisho
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Tuma ujumbe mpya
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message !== "") {
    const newMsg = {
      sender: currentUser,
      text: message,
      time: new Date().toLocaleTimeString()
    };
    messages.push(newMsg);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    chatInput.value = "";
    displayMessages();
  }
});

// Wakati ukurasa unafunguliwa
displayMessages();
