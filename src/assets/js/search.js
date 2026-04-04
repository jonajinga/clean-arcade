/* Pagefind Search */
var searchModal = null;
var pagefindLoaded = false;

function openSearch() {
  if (!searchModal) {
    searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.setAttribute("role", "dialog");
    searchModal.setAttribute("aria-label", "Search");
    searchModal.innerHTML = '<div class="search-modal__content" id="pagefind-container"></div>';
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) closeSearch();
    });
    document.body.appendChild(searchModal);
  }

  searchModal.classList.add("open");
  document.body.style.overflow = "hidden";

  if (!pagefindLoaded) {
    if (typeof PagefindUI !== "undefined") {
      new PagefindUI({
        element: "#pagefind-container",
        showSubResults: true,
        showImages: false,
      });
      pagefindLoaded = true;
    } else {
      document.getElementById("pagefind-container").innerHTML =
        '<p class="search-modal__fallback">Search is available after a production build.<br>Run <code>npm run build</code> to generate the search index.</p>';
    }
  }

  setTimeout(function () {
    var input = searchModal.querySelector(".pagefind-ui__search-input");
    if (input) input.focus();
  }, 100);
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
