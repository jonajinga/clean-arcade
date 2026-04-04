/* Multiplayer — Trystero WebRTC wrapper */
var currentRoom = null;

async function createRoom() {
  var code = generateCode();
  await connectToRoom(code);
  var display = document.getElementById("mp-room-display");
  if (display) display.textContent = code;
}

async function joinRoom() {
  var input = document.getElementById("mp-code");
  if (!input || !input.value.trim()) return;
  await connectToRoom(input.value.trim().toUpperCase());
}

async function connectToRoom(code) {
  if (currentRoom) {
    currentRoom.leave();
  }

  try {
    var trystero = await import("/assets/vendor/trystero/nostr.min.js");
    var joinRoomFn = trystero.joinRoom;

    var config = { appId: "clean-arcade" };
    var slug = typeof GAME_SLUG !== "undefined" ? GAME_SLUG : "lobby";
    var room = joinRoomFn(config, slug + "-" + code);

    var sendMove, onMove;
    [sendMove, onMove] = room.makeAction("move");

    var peerCount = 0;
    var statusEl = document.getElementById("mp-status");
    var peersEl = document.getElementById("mp-peers");
    var displayEl = document.getElementById("mp-room-display");

    if (statusEl) statusEl.hidden = false;
    if (displayEl) displayEl.textContent = code;

    room.onPeerJoin(function (peerId) {
      peerCount++;
      if (peersEl) peersEl.textContent = peerCount + " peer" + (peerCount !== 1 ? "s" : "");
      var iframe = document.getElementById("game-frame");
      if (iframe) iframe.contentWindow.postMessage({ type: "peer-joined", peerId: peerId }, "*");
    });

    room.onPeerLeave(function (peerId) {
      peerCount = Math.max(0, peerCount - 1);
      if (peersEl) peersEl.textContent = peerCount + " peer" + (peerCount !== 1 ? "s" : "");
      var iframe = document.getElementById("game-frame");
      if (iframe) iframe.contentWindow.postMessage({ type: "peer-left", peerId: peerId }, "*");
    });

    onMove(function (data, peerId) {
      var iframe = document.getElementById("game-frame");
      if (iframe) iframe.contentWindow.postMessage({ type: "peer-data", data: data, peerId: peerId }, "*");
    });

    /* Relay moves from game iframe to peers */
    window.addEventListener("message", function handler(e) {
      if (e.data && e.data.type === "game-move") {
        sendMove(e.data.payload);
      }
    });

    currentRoom = room;
  } catch (err) {
    console.error("Multiplayer connection failed:", err);
    var statusEl = document.getElementById("mp-status");
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "Connection failed. Check console for details.";
    }
  }
}

function generateCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "";
  for (var i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
