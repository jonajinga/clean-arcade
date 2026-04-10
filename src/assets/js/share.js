/* Share Game — dropdown with multiple options */
function shareGame(title, slug) {
  var url = window.location.origin + "/games/" + slug + "/";
  var text = "Play " + title + " on Clean Arcade";
  var encoded = encodeURIComponent(text + " " + url);
  var encodedUrl = encodeURIComponent(url);
  var encodedText = encodeURIComponent(text);

  /* Remove existing dropdown */
  var existing = document.getElementById("share-dropdown");
  if (existing) { existing.remove(); return; }

  var dd = document.createElement("div");
  dd.id = "share-dropdown";
  dd.className = "share-dropdown";
  dd.innerHTML =
    '<a href="https://twitter.com/intent/tweet?text=' + encoded + '" target="_blank" rel="noopener">X / Twitter</a>' +
    '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '" target="_blank" rel="noopener">Facebook</a>' +
    '<a href="https://www.reddit.com/submit?url=' + encodedUrl + '&title=' + encodedText + '" target="_blank" rel="noopener">Reddit</a>' +
    '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl + '" target="_blank" rel="noopener">LinkedIn</a>' +
    '<a href="https://api.whatsapp.com/send?text=' + encoded + '" target="_blank" rel="noopener">WhatsApp</a>' +
    '<a href="https://t.me/share/url?url=' + encodedUrl + '&text=' + encodedText + '" target="_blank" rel="noopener">Telegram</a>' +
    '<a href="mailto:?subject=' + encodedText + '&body=' + encoded + '">Email</a>' +
    '<a href="#" onclick="copyGameLink(\'' + url + '\');return false;">Copy Link</a>';

  /* Position near share button */
  var btn = document.getElementById("share-btn");
  if (btn) {
    var rect = btn.getBoundingClientRect();
    dd.style.top = (rect.bottom + 4) + "px";
    dd.style.right = (window.innerWidth - rect.right) + "px";
  }

  document.body.appendChild(dd);

  /* Close on outside click */
  setTimeout(function() {
    document.addEventListener("click", function closeShare(e) {
      if (!dd.contains(e.target) && e.target.id !== "share-btn") {
        dd.remove();
        document.removeEventListener("click", closeShare);
      }
    });
  }, 10);
}

function copyGameLink(url) {
  navigator.clipboard.writeText(url).then(function() {
    var dd = document.getElementById("share-dropdown");
    if (dd) {
      var copyBtn = dd.querySelector("a:last-child");
      if (copyBtn) { copyBtn.textContent = "Copied!"; setTimeout(function() { dd.remove(); }, 800); }
    }
  }).catch(function() {
    prompt("Copy this link:", url);
  });
}
