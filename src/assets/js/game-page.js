/* Game page — info overlay, share */
(function () {
  var embed = document.getElementById("game-embed");
  var overlay = document.getElementById("game-overlay");
  var infoBtn = document.getElementById("info-toggle");
  var closeBtn = document.getElementById("overlay-close");
  var shareBtn = document.getElementById("share-btn");

  if (!embed) return;

  /* --- Info overlay --- */
  if (infoBtn) infoBtn.addEventListener("click", function () {
    overlay.classList.toggle("visible");
  });
  if (closeBtn) closeBtn.addEventListener("click", function () {
    overlay.classList.remove("visible");
  });

  /* --- Share --- */
  if (shareBtn) shareBtn.addEventListener("click", function () {
    var title = document.querySelector(".game-embed__title");
    var name = title ? title.textContent.trim() : "Game";
    if (typeof shareGame === "function") shareGame(name, GAME_SLUG);
  });

  /* Keyboard */
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "Escape" && overlay) overlay.classList.remove("visible");
  });
})();
