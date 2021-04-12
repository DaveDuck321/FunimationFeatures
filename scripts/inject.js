// Functionality for when the video player is focused.

(function () {
  // Find out if we're running this on the video player iframe or on the rest of the page
  // then set these variables according to scope
  var playerFocus = false;
  var videoPlayer;
  var playerDoc;
  if (window.location.href.indexOf("player") > 0) {
    playerFocus = true;
    videoPlayer = document.getElementsByTagName("video")[0];
    playerDoc = document;
  } else {
    videoPlayer = document
      .getElementById("player")
      .contentDocument.getElementsByTagName("video")[0];
    playerDoc = document.getElementById("player").contentDocument;
  }

  console.log(
    "Injected FunimationFeatures into " + (playerFocus ? "player." : "page.")
  );

  // add keybinds!
  document.addEventListener("keydown", function (e) {
    switch (e.which) {
      case 37: // left arrow
        if (!(e.metaKey || e.shiftKey)) {
          videoPlayer.currentTime = videoPlayer.currentTime - 5;
        }
        break;
      case 38: // shift/meta + up arrow
        if (e.shiftKey || e.metaKey) {
          speedControl(0.25);
        } else if (videoPlayer.volume < 1) {
          e.preventDefault();
          videoPlayer.volume = videoPlayer.volume + 0.1;
        }
        break;
      case 39: // right arrow
        if (!(e.metaKey || e.ctrlKey)) {
          videoPlayer.currentTime = videoPlayer.currentTime + 5;
        }
        break;
      case 40: // shift/meta + down arrow
        if (e.shiftKey || e.metaKey) {
          speedControl(-0.25);
        } else if (videoPlayer.volume > 0) {
          e.preventDefault();
          videoPlayer.volume = videoPlayer.volume - 0.1;
        }
        break;
      case 83: // s key
        if (!e.metaKey || e.shiftKey) {
          videoPlayer.currentTime = videoPlayer.currentTime + 82;
        }
        break;
      case 32: // spacebar
        if (!playerFocus && (!e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          // Use the HTML click here to avoid desyncing GUI
          playerDoc.getElementById("funimation-control-playback").click();
        }
        break;
      case 48: // shift/meta + 0
        if (e.shiftKey || e.metaKey) {
          videoPlayer.playbackRate = 1;
          updatePlaybackGUI();
        }
        break;
      case 70: // F
        playerDoc.getElementById("funimation-control-fullscreen").click();
        break;
      case 72: //h
        toggleSubs();
        break;
      default:
        break;
    }
  });

  function toggleSubs() {
    let DOMSubs = playerDoc.getElementsByClassName("vjs-text-track-display")[0];
    if (DOMSubs.style.visibility === "hidden") {
      DOMSubs.style.visibility = "";
    } else {
      DOMSubs.style.visibility = "hidden";
    }
  }

  function speedControl(increment) {
    videoPlayer.playbackRate = Math.max(
      Math.min(videoPlayer.playbackRate + increment, 4.0),
      0.25
    );

    updatePlaybackGUI();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // VideoPlayer-only functions (stuff that doesn't need to be run on other sections of the page) //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  if (playerFocus) {
    initUI();
  }

  // Video player clicked
  var lastClickTime = 0;
  function playerClicked(e) {
    var thisClickTime = new Date().getTime();
    if (thisClickTime - lastClickTime < 400)
      playerDoc.getElementById("funimation-control-fullscreen").click();

    lastClickTime = thisClickTime;
    playerDoc.getElementById("funimation-control-playback").click();
  }

  // this is some (modified) ui code from the original FunimationFix!
  function initUI() {
    if (
      document.getElementsByClassName("funimation-controls-right").length > 0
    ) {
      let playback = document.createElement("span");
      playback.innerText = videoPlayer.playbackRate;
      let playbackContainer = document.createElement("div");
      playbackContainer.id = "playback";
      playbackContainer.className = "funimation-control funifix-control";
      playbackContainer.style.width = "20px";
      playbackContainer.appendChild(playback);

      let currentTime = document.createElement("span");
      currentTime.innerText = "0:00 / 0:00";
      let currentTimeContainer = document.createElement("div");
      currentTimeContainer.id = "currentTime";
      currentTimeContainer.className = "funimation-control funifix-control";
      currentTimeContainer.style.width = "160px";
      currentTimeContainer.appendChild(currentTime);

      let controls = document.getElementsByClassName(
        "funimation-controls-right"
      )[0];
      controls.insertBefore(playbackContainer, controls.firstChild);
      controls.insertBefore(currentTimeContainer, controls.firstChild);

      videoPlayer.playbackDisplay = playback;
      videoPlayer.currentTimeDisplay = currentTime;

      initListener();
    } else setTimeout(initUI, 100);
  }

  function initListener() {
    videoPlayer.addEventListener("timeupdate", updatePlaybackGUI);
    document
      .getElementById("funimation-gradient")
      .addEventListener("click", playerClicked);
    videoPlayer.addEventListener("click", playerClicked);
  }

  function updatePlaybackGUI(e) {
    const duration = getDisplayTime(videoPlayer.duration);
    const currentTime = getDisplayTime(videoPlayer.currentTime);

    videoPlayer.currentTimeDisplay.innerText = `${currentTime} / ${duration}`;
    videoPlayer.playbackDisplay.innerText = videoPlayer.playbackRate;
  }

  function getDisplayTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = parseInt((time / 60) % 60).toString();
    const seconds = parseInt(time % 60).toString();
    return `${minutes}:${seconds.padStart(2, 0)}`;
  }
})();
