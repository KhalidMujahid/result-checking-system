const button = document.querySelector(".button");
const logout = document.querySelector(".logout");

button?.addEventListener("click", (e) => {
  e.preventDefault();

  const c = confirm("Are you sure you want to logout?");

  if (c) {
    location.href = "/";
  } else {
    return;
  }
});

logout?.addEventListener("click", (e) => {
  e.preventDefault();

  const c = confirm("Are you sure you want to logout?");

  if (c) {
    location.href = "/admin/login";
  } else {
    return;
  }
});
