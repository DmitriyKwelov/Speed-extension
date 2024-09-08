function getQuerySelector() {
  const url = window.location.origin;
  let query;
  switch (url) {
    case "https://www.youtube.com":
      query = ".video-stream";
      break;
    case "https://vk.com":
      query = ".videoplayer_media_provider";
      break;
    default:
      query = null;
      break;
  }
  return query;
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "getQuerySelector":
      const url = window.location.origin;
      let query;
      switch (url) {
        case "https://www.youtube.com":
          query = ".video-stream";
          break;
        case "https://vk.com":
          query = ".videoplayer_media_provider";
          break;
        default:
          query = null;
          break;
      }
      sendResponse({ querySelector: query });
      break;
    case "getSpeed":
      {
        let video = document.querySelector(getQuerySelector());
        if (video) {
          sendResponse({ speed: video.playbackRate });
        } else {
          sendResponse({ speed: null });
        }
      }
      break;
    case "setSpeed":
      {
        let video = document.querySelector(getQuerySelector());
        video.playbackRate = request.speed;
        sendResponse({ status: "success" });
      }
      break;
  }
});
