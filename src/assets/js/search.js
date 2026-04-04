/* Search — dynamically loads Pagefind */
var searchModal = null;
var pagefindLoaded = false;

function openSearch() {
  if (!searchModal) {
    searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.setAttribute("role", "dialog");
    searchModal.setAttribute("aria-label", "Search");
    searchModal.innerHTML = '<div class="search-modal__content" id="pagefind-container"><p style="padding:2rem;text-align:center;color:#94a3b8">Loading search...</p></div>';
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) closeSearch();
    });
    document.body.appendChild(searchModal);
  }

  searchModal.classList.add("open");
  document.body.style.overflow = "hidden";

  if (!pagefindLoaded) {
    pagefindLoaded = true;
    /* Load Pagefind CSS */
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/pagefind/pagefind-ui.css";
    document.head.appendChild(link);
    /* Load Pagefind JS */
    var script = document.createElement("script");
    script.src = "/pagefind/pagefind-ui.js";
    script.onload = function () {
      document.getElementById("pagefind-container").innerHTML = "";
      new PagefindUI({
        element: "#pagefind-container",
        showSubResults: true,
        showImages: false,
      });
      setTimeout(function () {
        var input = document.querySelector(".pagefind-ui__search-input");
        if (input) input.focus();
      }, 50);
    };
    script.onerror = function () {
      document.getElementById("pagefind-container").innerHTML =
        '<p style="padding:2rem;text-align:center;color:#94a3b8">Search unavailable in dev mode.</p>';
    };
    document.head.appendChild(script);
  } else {
    setTimeout(function () {
      var input = searchModal.querySelector(".pagefind-ui__search-input");
      if (input) input.focus();
    }, 50);
  }
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
