// On page load
window.onload = function () {
  const user = localStorage.getItem("loggedInUser");
  const profileImage = localStorage.getItem("profileImage");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("usernameDisplay").textContent = user;

  if (profileImage) {
    document.getElementById("profileImage").src = profileImage;
  }
};

function uploadProfilePicture(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imageUrl = reader.result;
    localStorage.setItem("profileImage", imageUrl);
    document.getElementById("profileImage").src = imageUrl;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
