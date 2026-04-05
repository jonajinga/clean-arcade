/* Game Filtering & Sorting */
var activeCategory = "all";
var activeLetter = "all";

function filterGames(category) {
  activeCategory = category;
  /* Highlight active item in dropdown */
  var items = document.querySelectorAll("#cat-dropdown .game-filter__dropdown-item");
  items.forEach(function(item) {
    item.classList.toggle("active", item.getAttribute("data-filter") === category);
  });
  /* Highlight icon if filtered */
  var btn = document.getElementById("cat-toggle");
  if (btn) btn.classList.toggle("active", category !== "all");
  applyFilters();
}

function filterByLetter(letter) {
  activeLetter = letter;
  var items = document.querySelectorAll("#az-dropdown .game-filter__dropdown-item");
  items.forEach(function(item) {
    item.classList.toggle("active", item.getAttribute("data-letter") === letter);
  });
  var btn = document.getElementById("az-toggle");
  if (btn) btn.classList.toggle("active", letter !== "all");
  applyFilters();
}

function toggleSearch() {
  var input = document.getElementById("game-search");
  if (!input) return;
  input.classList.toggle("game-filter__search--hidden");
  if (!input.classList.contains("game-filter__search--hidden")) {
    input.focus();
  } else {
    input.value = "";
    searchGames("");
  }
  var btn = document.getElementById("search-toggle");
  if (btn) btn.classList.toggle("active", !input.classList.contains("game-filter__search--hidden"));
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
  updateClearBtn();
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

function updateClearBtn() {
  var btn = document.getElementById("clear-filters");
  if (!btn) return;
  var searchInput = document.getElementById("game-search");
  var hasSearch = searchInput && searchInput.value.length > 0;
  var hasFilter = activeCategory !== "all" || activeLetter !== "all" || activeSpecial !== null || hasSearch;
  btn.style.display = hasFilter ? "" : "none";
}

function clearAllFilters() {
  activeCategory = "all";
  activeLetter = "all";
  activeSpecial = null;

  var fb = document.getElementById("filter-favorites");
  var rb = document.getElementById("filter-recent");
  var cb = document.getElementById("cat-toggle");
  var ab = document.getElementById("az-toggle");
  var sb = document.getElementById("search-toggle");
  if (fb) fb.classList.remove("active");
  if (rb) rb.classList.remove("active");
  if (cb) cb.classList.remove("active");
  if (ab) ab.classList.remove("active");
  if (sb) sb.classList.remove("active");

  var searchInput = document.getElementById("game-search");
  if (searchInput) {
    searchInput.value = "";
    searchInput.classList.add("game-filter__search--hidden");
  }

  /* Reset dropdown active states */
  var catItems = document.querySelectorAll("#cat-dropdown .game-filter__dropdown-item");
  catItems.forEach(function(item) { item.classList.toggle("active", item.getAttribute("data-filter") === "all"); });
  var azItems = document.querySelectorAll("#az-dropdown .game-filter__dropdown-item");
  azItems.forEach(function(item) { item.classList.toggle("active", item.getAttribute("data-letter") === "all"); });

  applyFilters();
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
  updateClearBtn();
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

function toggleDropdown(id) {
  var target = document.getElementById(id);
  var drops = document.querySelectorAll(".game-filter__dropdown");
  drops.forEach(function(d) {
    if (d.id !== id) d.classList.remove("open");
  });
  if (target) target.classList.toggle("open");
}

/* Close dropdowns when clicking outside */
document.addEventListener("click", function(e) {
  if (!e.target.closest(".game-filter__dropdown-wrap")) {
    var drops = document.querySelectorAll(".game-filter__dropdown");
    drops.forEach(function(d) { d.classList.remove("open"); });
  }
});

/* Keyboard: Escape closes dropdowns */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    var drops = document.querySelectorAll(".game-filter__dropdown");
    drops.forEach(function(d) { d.classList.remove("open"); });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  sortAlpha();

  /* Restore view preference */
  if (localStorage.getItem("ca-view") === "list") {
    toggleView();
  }

  /* Restore filters from hash */
  var hash = window.location.hash.slice(1);
  if (!hash) return;
  var params = {};
  hash.split("&").forEach(function (pair) {
    var parts = pair.split("=");
    params[parts[0]] = parts[1];
  });
  if (params.letter) filterByLetter(params.letter);
  if (params.category) filterGames(params.category);
});
