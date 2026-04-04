/* Multiplayer — Trystero WebRTC */
(function () {
  var createBtn = document.getElementById("mp-create");
  var joinBtn = document.getElementById("mp-join");
  var codeInput = document.getElementById("mp-code");
  var nameInput = document.getElementById("mp-name");
  var statusEl = document.getElementById("mp-status");
  var displayEl = document.getElementById("mp-room-display");
  var peersEl = document.getElementById("mp-peers");

  if (!createBtn) return;

  var currentRoom = null;
  var sendMoveFn = null;
  var peerCount = 0;

  function getMyName() {
    var n = nameInput ? nameInput.value.trim() : "";
    return n || "Player";
  }

  function genCode() {
    var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", o = "";
    for (var i = 0; i < 5; i++) o += c[Math.floor(Math.random() * c.length)];
    return o;
  }

  function setStatus(text) {
    if (statusEl) statusEl.hidden = false;
    if (displayEl) displayEl.textContent = text;
  }

  async function connect(code) {
    setStatus("Connecting...");

    if (currentRoom) {
      try { currentRoom.leave(); } catch (e) {}
      currentRoom = null;
      sendMoveFn = null;
      peerCount = 0;
    }

    try {
      var mod = await import("https://esm.sh/trystero@0.18.0/nostr");
      var joinRoomFn = mod.joinRoom;
      var slug = typeof GAME_SLUG !== "undefined" ? GAME_SLUG : "lobby";
      var room = joinRoomFn({ appId: "clean-arcade" }, slug + "-" + code);

      var actions = room.makeAction("move");
      sendMoveFn = actions[0];
      var onMove = actions[1];

      setStatus(code);
      if (peersEl) peersEl.textContent = "waiting...";

      room.onPeerJoin(function (id) {
        peerCount++;
        if (peersEl) peersEl.textContent = peerCount + " connected";
        var f = document.getElementById("game-frame");
        if (f && f.contentWindow) {
          f.contentWindow.postMessage({ type: "peer-joined", peerId: id, name: getMyName() }, "*");
        }
        /* Send our name to the new peer */
        sendMoveFn({ _name: getMyName(), _type: "hello" });
      });

      room.onPeerLeave(function (id) {
        peerCount = Math.max(0, peerCount - 1);
        if (peersEl) peersEl.textContent = peerCount ? peerCount + " connected" : "waiting...";
        var f = document.getElementById("game-frame");
        if (f && f.contentWindow) f.contentWindow.postMessage({ type: "peer-left", peerId: id }, "*");
      });

      onMove(function (data, id) {
        var f = document.getElementById("game-frame");
        if (f && f.contentWindow) f.contentWindow.postMessage({ type: "peer-data", data: data, peerId: id }, "*");
      });

      currentRoom = room;

      /* Disable inputs after connecting */
      createBtn.disabled = true;
      joinBtn.disabled = true;
      if (codeInput) codeInput.disabled = true;
    } catch (err) {
      console.error("Multiplayer failed:", err);
      setStatus("Failed");
      if (peersEl) peersEl.textContent = err.message || "error";
    }
  }

  createBtn.addEventListener("click", function () {
    connect(genCode());
  });

  joinBtn.addEventListener("click", function () {
    if (!codeInput || !codeInput.value.trim()) return;
    connect(codeInput.value.trim().toUpperCase());
  });

  if (codeInput) codeInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") joinBtn.click();
  });

  /* Relay game moves to peers */
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "game-move" && sendMoveFn) {
      sendMoveFn(e.data.payload);
    }
  });
})();
