/* Game Loader — iframe communication bridge */
document.addEventListener("DOMContentLoaded", function () {
  var iframe = document.getElementById("game-frame");
  if (!iframe) return;

  iframe.addEventListener("load", function () {
    /* Send config to game */
    var mode = document.documentElement.getAttribute("data-mode") || "light";
    iframe.contentWindow.postMessage(
      {
        type: "ca-config",
        theme: mode,
        slug: typeof GAME_SLUG !== "undefined" ? GAME_SLUG : "",
      },
      "*"
    );

    /* Send saved state if available */
    if (typeof GAME_SLUG !== "undefined" && typeof SaveSystem !== "undefined") {
      var saved = SaveSystem.load(GAME_SLUG);
      if (saved) {
        iframe.contentWindow.postMessage(
          { type: "ca-load", state: saved },
          "*"
        );
      }
    }
  });
});
