/* Save System — localStorage */
var SaveSystem = {
  save: function (slug, data) {
    try {
      localStorage.setItem("ca-save-" + slug, JSON.stringify(data));
    } catch (e) {
      console.warn("Save failed:", e);
    }
  },

  load: function (slug) {
    try {
      var raw = localStorage.getItem("ca-save-" + slug);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  delete: function (slug) {
    localStorage.removeItem("ca-save-" + slug);
  },

  getAllSaves: function () {
    var saves = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.startsWith("ca-save-")) {
        var slug = key.replace("ca-save-", "");
        saves[slug] = JSON.parse(localStorage.getItem(key));
      }
    }
    return saves;
  },
};

/* Listen for save messages from game iframes */
window.addEventListener("message", function (e) {
  if (!e.data || e.data.type !== "ca-save") return;
  if (e.data.slug && e.data.state) {
    SaveSystem.save(e.data.slug, e.data.state);
  }
});
