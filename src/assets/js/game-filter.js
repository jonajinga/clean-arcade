/* Game Filtering & Sorting */
var activeCategory = "all";

function filterGames(category) {
  activeCategory = category;
  var cards = document.querySelectorAll(".game-card");
  var visible = 0;

  /* Sync dropdown if called programmatically */
  var catSelect = document.getElementById("category-select");
  if (catSelect && catSelect.value !== category) {
    catSelect.value = category;
  }

  cards.forEach(function (card) {
    var match = category === "all" || card.getAttribute("data-category") === category;
    var searchVal = document.getElementById("game-search")
      ? document.getElementById("game-search").value.toLowerCase()
      : "";
    var titleMatch =
      !searchVal || card.getAttribute("data-title").toLowerCase().includes(searchVal);
    var show = match && titleMatch;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });

  var noResults = document.getElementById("no-results");
  if (noResults) noResults.hidden = visible > 0;

  updateHash();
}

function searchGames(query) {
  filterGames(activeCategory);
}

function sortGames(sortBy) {
  var grid = document.getElementById("game-grid");
  if (!grid) return;
  var cards = Array.from(grid.querySelectorAll(".game-card"));

  cards.sort(function (a, b) {
    if (sortBy === "title") {
      return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"));
    }
    if (sortBy === "newest") {
      return b.getAttribute("data-date").localeCompare(a.getAttribute("data-date"));
    }
    if (sortBy === "difficulty") {
      var order = { easy: 0, medium: 1, hard: 2 };
      return (
        (order[a.getAttribute("data-difficulty")] || 0) -
        (order[b.getAttribute("data-difficulty")] || 0)
      );
    }
    return 0;
  });

  cards.forEach(function (card) {
    grid.appendChild(card);
  });

  updateHash();
}

function updateHash() {
  var sort = document.getElementById("sort-select");
  var hash = "";
  if (activeCategory !== "all") hash += "category=" + activeCategory;
  if (sort && sort.value !== "title") {
    hash += (hash ? "&" : "") + "sort=" + sort.value;
  }
  if (hash) {
    history.replaceState(null, "", "#" + hash);
  } else {
    history.replaceState(null, "", window.location.pathname);
  }
}

/* Restore from hash on load */
document.addEventListener("DOMContentLoaded", function () {
  var hash = window.location.hash.slice(1);
  if (!hash) return;
  var params = {};
  hash.split("&").forEach(function (pair) {
    var parts = pair.split("=");
    params[parts[0]] = parts[1];
  });
  if (params.sort) {
    var sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.value = params.sort;
      sortGames(params.sort);
    }
  }
  if (params.category) {
    filterGames(params.category);
  }
});
