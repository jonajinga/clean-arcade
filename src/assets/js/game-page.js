/* Game page — fullscreen, info overlay, share */
(function () {
  var embed = document.getElementById("game-embed");
  var iframe = document.getElementById("game-frame");
  var overlay = document.getElementById("game-overlay");
  var infoBtn = document.getElementById("info-toggle");
  var closeBtn = document.getElementById("overlay-close");
  var fsBtn = document.getElementById("fs-btn");
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

  /* --- Fullscreen --- */
  function rfs(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.webkitEnterFullscreen) return el.webkitEnterFullscreen();
    return null;
  }

  function exitFs() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    return null;
  }

  function isFsActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function toggleFullscreen() {
    if (isFsActive()) { exitFs(); return; }

    /* Mobile: try iframe directly first (better compatibility) */
    var isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isMobile && iframe) {
      var r = rfs(iframe);
      if (r && r.then) { r.catch(function () { rfs(embed) || rfs(document.documentElement); }); }
      else if (!r) { rfs(embed) || rfs(document.documentElement); }
      return;
    }

    /* Desktop: try embed container, fallback to documentElement */
    var result = rfs(embed);
    if (result && result.catch) {
      result.catch(function () { rfs(document.documentElement); });
    }
  }

  if (fsBtn) fsBtn.addEventListener("click", toggleFullscreen);

  /* Keyboard */
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "f" || e.key === "F") { e.preventDefault(); toggleFullscreen(); }
    if (e.key === "Escape" && overlay) overlay.classList.remove("visible");
  });
})();
