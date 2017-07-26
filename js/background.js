var options = null;

function callCognitiveService(apiUrl, subscriptionKey, sourceImageUrl, callback) {
    var returnValue = "";
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",
        function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                returnValue = callback(this.response);
            }
        }, false);
    try {
        xhr.open('POST', apiUrl, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');
    } catch (err) {
        returnValue = "DescribeThis was unable to call Microsoft Cognitive Services API: " + err;
    } 

    return returnValue;
}

function callCognitiveServiceAnalyze(sourceImageUrl) {
    var subscriptionKey = options.visionApiKey;
    var uriBase = "https://" + options.visionApiRegion + ".api.cognitive.microsoft.com/vision/v1.0/analyze?";
    var url = uriBase + "visualFeatures=Categories%2CDescription&language=en"; // TODO: Add to options page


    return callCognitiveService(url, subscriptionKey, sourceImageUrl,
        function (response) {
            return JSON.parse(response);
        }
    );
}

function callCognitiveServiceEmotion(sourceImageUrl) {
    var subscriptionKey = options.emotionApiKey;
    var uriBase = "https://" + options.emotionApiRegion + ".api.cognitive.microsoft.com/emotion/v1.0/recognize?";
    var url = uriBase;

    return callCognitiveService(url, subscriptionKey, sourceImageUrl,
        function (response) {
            return JSON.parse(response);
        }
    );
}

function processImage(sourceImageUrl) {
    var returnValue = "";

    // Call Analyze
    var analyze = callCognitiveServiceAnalyze(sourceImageUrl);

    returnValue = analyze.description.captions[0].text +
        " (" + (parseInt(analyze.description.captions[0].confidence * 1000) / 10) + "%)";

    if (hasPersonTag(analyze.description.tags)) {

        // If it's a person, get their emotion
        var people = callCognitiveServiceEmotion(sourceImageUrl);
        var peopleLength = people.length;
        if (peopleLength > 0) {
            for (var p = 0; p < peopleLength; p++) {
                var scores = people[p].scores;
                var items = Object.keys(scores).map(function (key) {
                    return [key, scores[key]];
                });
                items.sort(function (first, second) {
                    return second[1] - first[1];
                });
                var emotions = (items.slice(0, 1));
                returnValue += "\r\n" + emotions[0][0];

            }
        }
    }

    return returnValue;

};

function hasPersonTag(tags) {
    var hasPerson = false;

    var tagsLength = tags.length;
    for (var i = 0; i < tagsLength; i++) {
        if (tags[i] == "person") {
            hasPerson = true;
            break;
        }
    }
    return hasPerson;
}


function getOptions() {
    let settings = browser.storage.sync.get(
        [
            "visionApiRegion",
            "visionApiKey",
            "emotionApiRegion",
            "emotionApiKey"
        ], getOptionsCallback);
}

function getOptionsCallback(settings) {
    if (settings.visionApiKey == null) {
        alert("set options first");
    } else {
        options = settings;
    }
}

function displayText(status, text) {
    alert(text); // TODO: Change this.
}

function displayFailure(text) {
    displayText(null, "Failure: " + text);
}

function displaySuccess(text) {
    displayText(null, text);
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
                displayFailure("Cannot analyze dataUri images.");
            } else {
                displaySuccess(processImage(info.srcUrl));
            }
        }
    }
});

if (options == null) { getOptions(); }
