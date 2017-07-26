function Extension() {
    var _Storage = null;
    var _Options = null;
    var _Cognitive = null;
    var _Setup = false;

    function _getOptionsCallback(settings) {
        if (settings.visionApiKey == null) {
            abandon("set options first");
        } else {
            _Options = settings;
            _Cognitive = CognitiveServices(_Options);
            _Setup = true;
        }
    }

    function abandon(message) {
        throw message; //TODO: Change to something more meaningful
    };

    function processImage(sourceImageUrl) {
        var returnObj = {
            "caption": "",
            "confidence": 0,
            "people": 0,
            "emotions": []
        };

        var analyze = _Cognitive.VisionAnalyze(sourceImageUrl);

        returnObj.caption = analyze.description.captions[0].text;
        returnObj.confidence = (parseInt(analyze.description.captions[0].confidence * 1000) / 10);

        if (analyze.hasPerson) {

            // If it's a person, get their emotion
            var people = _Cognitive.EmotionRecognize(sourceImageUrl);
            var peopleLength = people.length;

            returnObj.people = peopleLength;

            if (peopleLength > 0) {
                for (var p = 0; p < peopleLength; p++) {
                    var scores = people[p].scores;
                    var items = Object.keys(scores).map(
                        function (key) {return [key, scores[key]];});
                    items.sort(
                        function (first, second) {return second[1] - first[1];});
                    var emotions = (items.slice(0, 1));
                    returnObj.emotions.push(emotions[0][0]);
                }
            }
        }
        return returnObj;
    };


    function setupExtension() {
        if (_Setup) return;

        _Storage = ExtensionStorage(this);
        // Load options
        if (_Options == null) {
            _Storage.getAllOptionSettings(_getOptionsCallback);
        }
        
    }

    return {
        "abandon": abandon,
        "processImage": processImage,
        "setup": setupExtension
    };
}

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