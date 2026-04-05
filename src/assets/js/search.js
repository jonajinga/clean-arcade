/* Search — simple game search modal */
var searchModal = null;
var searchInput = null;
var searchResults = null;
var allGamesData = null;

function openSearch() {
  if (!searchModal) {
    searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.setAttribute("role", "dialog");
    searchModal.setAttribute("aria-label", "Search");
    searchModal.innerHTML =
      '<div class="search-modal__content">' +
      '<input type="search" class="search-modal__input" placeholder="Search games..." autofocus>' +
      '<div class="search-modal__results"></div>' +
      '</div>';
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) closeSearch();
    });
    document.body.appendChild(searchModal);
    searchInput = searchModal.querySelector(".search-modal__input");
    searchResults = searchModal.querySelector(".search-modal__results");
    searchInput.addEventListener("input", function () {
      renderSearchResults(this.value.toLowerCase().trim());
    });
  }

  /* Load game data from the page if available */
  if (!allGamesData) {
    var cards = document.querySelectorAll(".game-card");
    if (cards.length) {
      allGamesData = [];
      cards.forEach(function (card) {
        allGamesData.push({
          title: card.getAttribute("data-title") || card.textContent.trim(),
          href: card.getAttribute("href"),
          category: card.getAttribute("data-category") || ""
        });
      });
    }
  }

  /* Fallback: fetch from /games/ pages */
  if (!allGamesData || !allGamesData.length) {
    allGamesData = [];
    searchResults.innerHTML = '<p style="color:#94a3b8;padding:1rem;">Search from the home page.</p>';
  }

  searchModal.classList.add("open");
  document.body.style.overflow = "hidden";
  searchInput.value = "";
  searchInput.focus();
  renderSearchResults("");
}

function renderSearchResults(query) {
  if (!searchResults || !allGamesData) return;
  if (!query) {
    searchResults.innerHTML = '<p style="color:#94a3b8;padding:0.5rem;">Type to search ' + allGamesData.length + ' games</p>';
    return;
  }
  var matches = allGamesData.filter(function (g) {
    return g.title.toLowerCase().indexOf(query) !== -1 ||
           g.category.toLowerCase().indexOf(query) !== -1;
  });
  if (!matches.length) {
    searchResults.innerHTML = '<p style="color:#94a3b8;padding:0.5rem;">No games found</p>';
    return;
  }
  searchResults.innerHTML = matches.map(function (g) {
    return '<a href="' + g.href + '" class="search-modal__item">' + g.title + ' <span>' + g.category + '</span></a>';
  }).join("");
}

function closeSearch() {
  if (searchModal) {
    searchModal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") closeSearch();
});
