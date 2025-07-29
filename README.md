# Tanzanite-Chat
My Social media App Tanzanite Chat 
<!-- Tanzanite Chat App - Basic Version --><!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tanzanite Chat</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f4f8;
      margin: 0;
      padding: 0;
    }
    .navbar {
      background-color: #001f3f;
      color: #fff;
      padding: 10px;
      text-align: center;
      font-size: 24px;
    }
    .chat-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .message {
      padding: 10px;
      margin: 5px 0;
      background: #dfe9f3;
      border-radius: 5px;
    }
    .input-group {
      display: flex;
      margin-top: 15px;
    }
    input[type="text"] {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 4px;
    }
    button {
      padding: 10px 20px;
      border: none;
      background-color: #0074d9;
      color: #fff;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    #searchResults p {
      padding: 5px;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="navbar">Tanzanite Chat</div>
  <div class="chat-container">
    <h3>Welcome, User!</h3><input type="text" id="searchInput" placeholder="Tafuta marafiki..." />
<div id="searchResults"></div>

<div class="messages" id="messages"></div>
<div class="input-group">
  <input type="text" id="messageInput" placeholder="Andika ujumbe..." />
  <button onclick="sendMessage()">Tuma</button>
</div>

  </div>  <script>
    const messagesDiv = document.getElementById("messages");

    function sendMessage() {
      const input = document.getElementById("messageInput");
      const text = input.value;
      if (text.trim() !== "") {
        const div = document.createElement("div");
        div.className = "message";
        div.textContent = text;
        messagesDiv.appendChild(div);
        input.value = "";
      }
    }

    document.getElementById("searchInput").addEventListener("input", function () {
      let query = this.value;
      if (query.length > 2) {
        fetch("search.php?query=" + query)
          .then(res => res.json())
          .then(data => {
            let html = "";
            data.forEach(user => {
              html += `<p>${user.username}</p>`;
            });
            document.getElementById("searchResults").innerHTML = html;
          });
      } else {
        document.getElementById("searchResults").innerHTML = "";
      }
    });
  </script></body>
</html>
