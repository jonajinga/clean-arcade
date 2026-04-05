/* Game Filtering & Sorting */
var activeCategory = "all";
var activeLetter = "all";

function filterGames(category) {
  activeCategory = category;

  /* Sync dropdown if called programmatically */
  var catSelect = document.getElementById("category-select");
  if (catSelect && catSelect.value !== category) {
    catSelect.value = category;
  }

  applyFilters();
}

function filterByLetter(letter) {
  activeLetter = letter;

  var btns = document.querySelectorAll(".game-filter__letter");
  btns.forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-letter") === letter);
  });

  applyFilters();
}

function applyFilters() {
  var cards = document.querySelectorAll(".game-card");
  var visible = 0;

  var searchVal = document.getElementById("game-search")
    ? document.getElementById("game-search").value.toLowerCase()
    : "";

  cards.forEach(function (card) {
    var catMatch = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
    var titleMatch = !searchVal || card.getAttribute("data-title").toLowerCase().includes(searchVal);
    var letterMatch = activeLetter === "all" || card.getAttribute("data-title").charAt(0).toUpperCase() === activeLetter;
    var show = catMatch && titleMatch && letterMatch;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });

  var noResults = document.getElementById("no-results");
  if (noResults) noResults.hidden = visible > 0;

  updateHash();
}

function searchGames(query) {
  applyFilters();
}

function sortGames(sortBy) {
  var grid = document.getElementById("game-grid");
  if (!grid) return;
  var cards = Array.from(grid.querySelectorAll(".game-card"));

  cards.sort(function (a, b) {
    return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"));
  });

  cards.forEach(function (card) {
    grid.appendChild(card);
  });

  updateHash();
}

function updateHash() {
  var hash = "";
  if (activeCategory !== "all") hash += "category=" + activeCategory;
  if (activeLetter !== "all") {
    hash += (hash ? "&" : "") + "letter=" + activeLetter;
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
  if (params.letter) {
    filterByLetter(params.letter);
  }
  if (params.category) {
    filterGames(params.category);
  }
});
