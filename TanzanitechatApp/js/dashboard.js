// === Sehemu ya zamani ya JS haijabadilishwa ===

// ==== NOTIFICATION SYSTEM ====

let notificationCount = 0;

function addNotification(message) {
  notificationCount++;
  const countEl = document.getElementById("notification-count");
  countEl.textContent = notificationCount;
  countEl.style.display = "inline";

  // Optional: alert popup
  alert(message);
}

// Mfano wa kutumia:
// addNotification("Umepewa like mpya!");

// ==== SEARCH YA MARAFIKI ====

document.getElementById("friend-search").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const friends = document.querySelectorAll("#friend-list li");

  friends.forEach((friend) => {
    const name = friend.textContent.toLowerCase();
    friend.style.display = name.includes(searchValue) ? "" : "none";
  });
});

// ==== CHAT LIVE TYPING INDICATOR ====

const chatInput = document.getElementById("chat-input"); // Hakikisha sehemu hii ipo kwenye chat.html
const typingIndicator = document.getElementById("typing-indicator");
let typingTimeout;

if (chatInput && typingIndicator) {
  chatInput.addEventListener("input", () => {
    typingIndicator.style.display = "block";

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      typingIndicator.style.display = "none";
    }, 2000); // itaondoa baada ya 2 sekunde bila kuandika
  });
}
