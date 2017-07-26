var OptionController = {
    "abandon": function (message) { displayGetError(message); }
}
var _Storage = ExtensionStorage(OptionController);
var _Options = null;

function load(event) {
    _Storage.getAllOptionSettings(storageGetComplete);

    document.getElementById("saveOptions").addEventListener("click", saveOptions, false);

}


function storageGetComplete(settings) {
    // Save global settings
    _Options = settings;

    var error = browser.runtime.lastError;

    if (error) {
        displayGetError();
    } else {

        // Get Congitive Services Settings
        document.getElementById("visionApiRegion").value = settings.visionApiRegion;
        document.getElementById("visionApiKey").value = settings.visionApiKey;
        document.getElementById("emotionApiRegion").value = settings.emotionApiRegion;
        document.getElementById("emotionApiKey").value = settings.emotionApiKey;

        setDisplay(MessageType.success, "Settings retrieved");
    }
}

function displayGetError(settings) {
    var error = browser.runtime.lastError;
    setDisplay(MessageType.error, "Unable to get settings: " + error);
}

function saveOptions(event) {
    let settings = {
        /* Cognitive Services Settings */
        "visionApiRegion": document.getElementById("visionApiRegion").value,
        "visionApiKey": document.getElementById("visionApiKey").value,
        "emotionApiRegion": document.getElementById("emotionApiRegion").value,
        "emotionApiKey": document.getElementById("emotionApiKey").value,

    };
    _Storage.setAllOptionSettings(settings, storageSetComplete);
}

function storageSetComplete() {
    var error = browser.runtime.lastError;

    if (error) {
        displaySaveError(error);
    } else {
        displaySaveSuccess();
    }

}

function displaySaveError(error) {
    setDisplay(MessageType.error, "Unable to save settings: " + error);
}

function displaySaveSuccess() {
    setDisplay(MessageType.success, "Settings saved");

}

function setDisplay(dispType, text) {
    var displayBox = document.getElementById("displayBox");
    var infoBox = document.getElementById("userInformation");
    infoBox.innerHTML = text;

    switch (dispType) {
        case MessageType.error:
            infoBox.className = "infoBoxError";
            break; 
        case MessageType.information:
            infoBox.className = "infoBoxInformation";
            break;
        case MessageType.success:
            infoBox.className = "infoBoxSuccess";
            break;
        default:
            break;
    } 
    displayBox.classList.remove("hidden");
    setTimeout(function () { displayBox.classList.add("hidden"); }, 2000);
}

window.addEventListener("load", load, false);