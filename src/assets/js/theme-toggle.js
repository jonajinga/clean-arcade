/* Theme Toggle */
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute("data-mode");
  var next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-mode", next);
  localStorage.setItem("theme", next);
}
