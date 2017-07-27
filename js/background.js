_Extension = Extension();
_Extension.setup();


function displayText(id, status, text) {
    console.log(text); // TODO: Change this to display over the image.
};

function displayFailure(id, text) {
    displayText(id, MessageType.error, text);
};

function displaySuccess(id, text) {
    displayText(id, MessageType.success, text);
};

function formatResult(obj) {
    // TODO: Localize and relocate to the page somewhere.
    var result = "Caption: " + obj.caption + "\r\n";
    if (obj.people > 0) {
        result += "Emotions: " + obj.emotions.toString();
    }
    return result;
}

function handleSrc(message) {
    if (message.src) {
        if (message.src.slice(0, 5) == "data:") {
            displayFailure(message.id, "Cannot analyze dataUri images."); // TODO: Localize this
        } else {
            _Extension.processImage(message.src, function (obj) {
                displaySuccess(message.tabId, formatResult(obj));
            });
        }
    }
}

browser.contextMenus.create({
    id: "describe-this",
    title: "DescribeThis!",
    contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    var tabId = null;
    if (tab) { tabId = tab.id;}

    if (info.menuItemId == "describe-this") {
        handleSrc({ "tabId": tabId, "src": info.srcUrl });
    }
});

browser.runtime.onMessage.addListener(function (message) {
    var gettingTab = browser.tabs.getCurrent(function (tab) {
        var tabId = null;
        if (tab) {
            tabId = tab.id;
            console.log("Found a tabId! ${tabId}");
        }
        message.tabId = tabId;
        handleSrc(message);
    });

});