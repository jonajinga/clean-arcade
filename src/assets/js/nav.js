/* Navigation — Hamburger Panel */
function openHamburger() {
  var panel = document.getElementById("hamburger-panel");
  var btn = document.getElementById("hamburger-btn");
  if (!panel) return;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  if (btn) btn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeHamburger() {
  var panel = document.getElementById("hamburger-panel");
  var btn = document.getElementById("hamburger-btn");
  if (!panel) return;
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  if (btn) btn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeHamburger();
});
