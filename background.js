// Add a listener for when the popup window is opened  
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type == "storeCookie") {
    // Store the cookie name and value in local storage for the current domain
    var currentTabDomain = message.tabDomain;
    var cookieName = message.cookieName;
    chrome.cookies.get({ url: "https://" + currentTabDomain, name: cookieName }, function (cookie) {
      if (cookie) {
        var cookieValue = cookie.value;
        chrome.storage.local.get({ [currentTabDomain]: {} }, function (result) {
          result[currentTabDomain].cookieName = cookieName;
          result[currentTabDomain].cookieValue = cookieValue;
          chrome.storage.local.set(result, function () {
            console.log(
                "Cookie stored for " +
                currentTabDomain +
                ": " +
                cookieName +
                "=" +
                cookieValue
            );
            // Copy the cookie value to the clipboard
            copyToClipboard(cookieValue);
          });
        });
      } else {
        // The cookie was not found
        console.log("Cookie not found: " + cookieName);
      }
    });
  }
});

function copyToClipboard(text) {
  const input = document.createElement("textarea");
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}