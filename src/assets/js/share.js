/* Share Game */
function shareGame(title, slug) {
  var url = window.location.origin + "/games/" + slug + "/";
  var text = "Play " + title + " on Clean Arcade — free, no ads!";

  if (navigator.share) {
    navigator.share({ title: title, text: text, url: url }).catch(function () {});
  } else {
    navigator.clipboard
      .writeText(url)
      .then(function () {
        alert("Link copied to clipboard!");
      })
      .catch(function () {
        prompt("Copy this link:", url);
      });
  }
}
