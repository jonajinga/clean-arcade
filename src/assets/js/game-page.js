/* Game page — fullscreen, info overlay, share */
(function () {
  var embed = document.getElementById("game-embed");
  var overlay = document.getElementById("game-overlay");
  var infoBtn = document.getElementById("info-toggle");
  var closeBtn = document.getElementById("overlay-close");
  var fsBtn = document.getElementById("fs-btn");
  var shareBtn = document.getElementById("share-btn");

  if (!embed) return;

  /* --- Info overlay --- */
  function showInfo() {
    overlay.classList.toggle("visible");
  }

  if (infoBtn) infoBtn.addEventListener("click", showInfo);
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
  function enterFullscreen(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return null;
  }

  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return null;
  }

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function toggleFullscreen() {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      var result = enterFullscreen(embed);
      /* If the promise rejects, try documentElement */
      if (result && result.catch) {
        result.catch(function () {
          enterFullscreen(document.documentElement);
        });
      }
    }
  }

  if (fsBtn) fsBtn.addEventListener("click", toggleFullscreen);

  /* Keyboard shortcuts */
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }
    if (e.key === "Escape" && overlay) {
      overlay.classList.remove("visible");
    }
  });
})();
