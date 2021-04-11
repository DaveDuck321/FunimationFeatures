// This code is based on FunimationFix by Bitter Buffalo
// https://chrome.google.com/webstore/detail/funimationfix/ocngipibkfmmjmjpoeeiiaofeeclmlik?hl=en

// FunimationFeatures has been updated and expanded on by Alex Schumaker. https://github.com/alexschumaker/FunimationFeatures

(function () {
  if (window.top == window) {
    console.log("FunimationFeatures version " + version + " loaded.");

    var version = "1.0";

    // resizing function realized by Bitter Buffalo.
    function setSize() {
      try {
        console.log("resize", window.innerHeight);
        var height =
          window.innerHeight -
          document.getElementById("funimation-main-site-header").offsetHeight -
          document.getElementById("funimation-main-site-header").offsetTop -
          5;

        document.getElementsByClassName(
          "video-player-container"
        )[0].style.maxHeight = height + "px";
        document
          .getElementsByClassName("video-player-section")[0]
          .getElementsByClassName(
            "container"
          )[0].style.maxWidth = document.getElementsByClassName(
          "video-player-container"
        )[0].style.maxWidth = (16 / 9) * height + "px";
      } catch (err) {}
    }

    window.addEventListener("resize", setSize);
    setSize();
  }

  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("scripts/inject.js");
  document.getElementsByTagName("head")[0].appendChild(script);
})();
