/* Multiplayer — Trystero WebRTC wrapper */
var currentRoom = null;
var sendMove = null;

async function createRoom() {
  var code = generateCode();
  await connectToRoom(code);
}

async function joinRoom() {
  var input = document.getElementById("mp-code");
  if (!input || !input.value.trim()) return;
  await connectToRoom(input.value.trim().toUpperCase());
}

async function connectToRoom(code) {
  var statusEl = document.getElementById("mp-status");
  var peersEl = document.getElementById("mp-peers");
  var displayEl = document.getElementById("mp-room-display");

  if (statusEl) { statusEl.hidden = false; }
  if (displayEl) { displayEl.textContent = "Connecting..."; }

  if (currentRoom) {
    try { currentRoom.leave(); } catch(e) {}
    currentRoom = null;
  }

  try {
    var trystero = await import("https://esm.sh/trystero@0.18.0/nostr");
    var joinRoomFn = trystero.joinRoom;

    var config = { appId: "clean-arcade" };
    var slug = typeof GAME_SLUG !== "undefined" ? GAME_SLUG : "lobby";
    var room = joinRoomFn(config, slug + "-" + code);

    var actions = room.makeAction("move");
    sendMove = actions[0];
    var onMove = actions[1];

    var peerCount = 0;

    if (displayEl) displayEl.textContent = code;

    room.onPeerJoin(function (peerId) {
      peerCount++;
      if (peersEl) peersEl.textContent = peerCount + " peer" + (peerCount !== 1 ? "s" : "");
      var iframe = document.getElementById("game-frame");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "peer-joined", peerId: peerId }, "*");
      }
    });

    room.onPeerLeave(function (peerId) {
      peerCount = Math.max(0, peerCount - 1);
      if (peersEl) peersEl.textContent = peerCount + " peer" + (peerCount !== 1 ? "s" : "");
      var iframe = document.getElementById("game-frame");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "peer-left", peerId: peerId }, "*");
      }
    });

    onMove(function (data, peerId) {
      var iframe = document.getElementById("game-frame");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "peer-data", data: data, peerId: peerId }, "*");
      }
    });

    currentRoom = room;
  } catch (err) {
    console.error("Multiplayer connection failed:", err);
    if (displayEl) displayEl.textContent = "Connection failed";
    if (statusEl) statusEl.hidden = false;
  }
}

/* Relay moves from game iframe to peers */
window.addEventListener("message", function (e) {
  if (e.data && e.data.type === "game-move" && sendMove) {
    sendMove(e.data.payload);
  }
});

function generateCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "";
  for (var i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
