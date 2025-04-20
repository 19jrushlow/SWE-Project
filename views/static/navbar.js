document.addEventListener("DOMContentLoaded", async function () {
  console.log("Loading navbar...");

  const navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) {
      console.error("#navbar-container NOT found");
      return;
  }

  fetch('/navbar.html')
      .then(response => response.text())
      .then(async (data) => {
          navbarContainer.innerHTML = data;

          try {
              const sessionResponse = await fetch('/api/user/session');
              if (sessionResponse.ok) {
                  const user = await sessionResponse.json();
                  console.log("User session:", user);

                  const profileLink = document.getElementById('nav-profile');
                  if (profileLink) {
                      profileLink.href = `/user/${user.id}`;
                  }
                  document.getElementById("nav-signup").parentElement.remove();
                  document.getElementById("nav-login").parentElement.remove();
              }
              else {
                  document.getElementById("nav-profile").parentElement.remove();
              }
  
              // highlight current location
              const currentUrl = window.location.pathname;
              const navLinks = document.querySelectorAll('.nav-links a');
              navLinks.forEach(link => {
              if (link.getAttribute('href') === currentUrl) {
                link.classList.add('active');
              }
  });

          } catch (error) {
              console.error("Error fetching user session:", error);
          }
      })
      .catch(error => console.error("Navbar loading error:", error));
});
