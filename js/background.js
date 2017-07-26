_Extension = Extension();
_Extension.setup();


function displayText(status, text) {
    alert(text); // TODO: Change this to display over the image.
};

function displayFailure(text) {
    displayText(MessageType.error, text);
};

function displaySuccess(text) {
    displayText(MessageType.success, text);
};

function formatResult(obj) {
    // TODO: Localize and relocate to the page somewhere.
    var result = "Caption: " + obj.caption + "\r\n";
    if (obj.people > 0) {
        result += "Emotions: " + obj.emotions.toString();
    }
    return result;
}

browser.contextMenus.create({
    id: "describe-this",
    title: "DescribeThis!",
    contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "describe-this") {
        if (info.srcUrl) {
            if (info.srcUrl.slice(0, 5) == "data:") {
                displayFailure("Cannot analyze dataUri images."); // TODO: Localize this
            } else {
                displaySuccess(formatResult(_Extension.processImage(info.srcUrl)));
            }
        }
    }
});