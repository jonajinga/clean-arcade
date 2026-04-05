/* Game Filtering & Sorting */
var activeCategory = "all";
var activeLetter = "all";

function filterGames(category) {
  activeCategory = category;
  var catSelect = document.getElementById("category-select");
  if (catSelect && catSelect.value !== category) catSelect.value = category;
  applyFilters();
}

function filterByLetter(letter) {
  activeLetter = letter;
  var letterSelect = document.getElementById("letter-select");
  if (letterSelect && letterSelect.value !== letter) letterSelect.value = letter;
  applyFilters();
}

function applyFilters() {
  /* Clear special filter when using normal filters */
  if (activeSpecial) {
    activeSpecial = null;
    var fb = document.getElementById("filter-favorites");
    var rb = document.getElementById("filter-recent");
    if (fb) fb.classList.remove("active");
    if (rb) rb.classList.remove("active");
  }

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
  sortAlpha();
  updateHash();
}

function searchGames(query) {
  applyFilters();
}

function sortAlpha() {
  var grid = document.getElementById("game-grid");
  if (!grid) return;
  var cards = Array.from(grid.querySelectorAll(".game-card"));
  cards.sort(function (a, b) {
    return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"));
  });
  cards.forEach(function (card) { grid.appendChild(card); });
}

function updateHash() {
  var hash = "";
  if (activeCategory !== "all") hash += "category=" + activeCategory;
  if (activeLetter !== "all") hash += (hash ? "&" : "") + "letter=" + activeLetter;
  if (hash) {
    history.replaceState(null, "", "#" + hash);
  } else {
    history.replaceState(null, "", window.location.pathname);
  }
}

/* Favorites / Recently played filters */
var activeSpecial = null;

function filterFavorites() {
  var btn = document.getElementById("filter-favorites");
  if (activeSpecial === "favorites") {
    activeSpecial = null;
    btn.classList.remove("active");
    applyFilters();
    return;
  }
  activeSpecial = "favorites";
  btn.classList.add("active");
  var rb = document.getElementById("filter-recent");
  if (rb) rb.classList.remove("active");

  var favs = [];
  try { favs = JSON.parse(localStorage.getItem("ca-favorites") || "[]"); } catch(e) {}
  filterBySlugList(favs);
}

function filterRecent() {
  var btn = document.getElementById("filter-recent");
  if (activeSpecial === "recent") {
    activeSpecial = null;
    btn.classList.remove("active");
    applyFilters();
    return;
  }
  activeSpecial = "recent";
  btn.classList.add("active");
  var fb = document.getElementById("filter-favorites");
  if (fb) fb.classList.remove("active");

  var recent = [];
  try { recent = JSON.parse(localStorage.getItem("ca-recent") || "[]").map(function(r) { return r.slug; }); } catch(e) {}
  filterBySlugList(recent);
}

function filterBySlugList(slugs) {
  var cards = document.querySelectorAll(".game-card");
  var visible = 0;
  cards.forEach(function(card) {
    var slug = card.getAttribute("href").replace("/games/", "").replace("/", "");
    var show = slugs.indexOf(slug) !== -1;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  var noResults = document.getElementById("no-results");
  if (noResults) noResults.hidden = visible > 0;
  sortAlpha();
}

/* View toggle — grid vs list */
function toggleView() {
  var grid = document.getElementById("game-grid");
  if (!grid) return;
  var isList = grid.classList.toggle("game-grid--list");
  document.getElementById("view-icon-list").style.display = isList ? "none" : "";
  document.getElementById("view-icon-grid").style.display = isList ? "" : "none";
  localStorage.setItem("ca-view", isList ? "list" : "grid");
}

document.addEventListener("DOMContentLoaded", function () {
  sortAlpha();
  var hash = window.location.hash.slice(1);
  if (!hash) return;
  var params = {};
  hash.split("&").forEach(function (pair) {
    var parts = pair.split("=");
    params[parts[0]] = parts[1];
  });
  if (params.letter) filterByLetter(params.letter);
  if (params.category) filterGames(params.category);

  /* Restore view preference */
  if (localStorage.getItem("ca-view") === "list") {
    toggleView();
  }
});
