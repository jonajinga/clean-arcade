/* Pagefind Search */
var searchModal = null;
var pagefindLoaded = false;

function openSearch() {
  if (!searchModal) {
    searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.innerHTML =
      '<div class="search-modal__content" id="pagefind-container"></div>';
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) closeSearch();
    });
    document.body.appendChild(searchModal);
  }

  searchModal.classList.add("open");
  document.body.style.overflow = "hidden";

  if (!pagefindLoaded && typeof PagefindUI !== "undefined") {
    new PagefindUI({
      element: "#pagefind-container",
      showSubResults: true,
      showImages: false,
    });
    pagefindLoaded = true;
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
