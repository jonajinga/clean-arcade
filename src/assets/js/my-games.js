/* My Games — Recently Played & Favorites */
var MyGames = {
  getRecent: function () {
    try {
      return JSON.parse(localStorage.getItem("ca-recent") || "[]");
    } catch (e) {
      return [];
    }
  },

  addRecent: function (slug) {
    var recent = this.getRecent().filter(function (r) {
      return r.slug !== slug;
    });
    recent.unshift({ slug: slug, time: Date.now() });
    if (recent.length > 20) recent = recent.slice(0, 20);
    localStorage.setItem("ca-recent", JSON.stringify(recent));
  },

  getFavorites: function () {
    try {
      return JSON.parse(localStorage.getItem("ca-favorites") || "[]");
    } catch (e) {
      return [];
    }
  },

  isFavorite: function (slug) {
    return this.getFavorites().indexOf(slug) !== -1;
  },

  toggleFavorite: function (slug) {
    var favs = this.getFavorites();
    var idx = favs.indexOf(slug);
    if (idx === -1) {
      favs.push(slug);
    } else {
      favs.splice(idx, 1);
    }
    localStorage.setItem("ca-favorites", JSON.stringify(favs));
    return idx === -1;
  },
};

function toggleFavorite(slug) {
  var isFav = MyGames.toggleFavorite(slug);
  var heartPath = document.getElementById("heart-path");
  var favLabel = document.getElementById("fav-label");
  if (heartPath) heartPath.setAttribute("fill", isFav ? "currentColor" : "none");
  if (favLabel) favLabel.textContent = isFav ? "Favorited" : "Favorite";
}

/* Track game play on game pages */
if (typeof GAME_SLUG !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    MyGames.addRecent(GAME_SLUG);

    /* Restore favorite state */
    if (MyGames.isFavorite(GAME_SLUG)) {
      var heartPath = document.getElementById("heart-path");
      var favLabel = document.getElementById("fav-label");
      if (heartPath) heartPath.setAttribute("fill", "currentColor");
      if (favLabel) favLabel.textContent = "Favorited";
    }
  });
}
