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
    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = ""; // TODO: Add to options page
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?";
    var url = uriBase + "visualFeatures=Categories%2CDescription&language=en"; // TODO: Add to options page


    return callCognitiveService(url, subscriptionKey, sourceImageUrl,
        function (response) {
            return JSON.parse(response);
        }
    );
}

function callCognitiveServiceEmotion(sourceImageUrl) {
    var subscriptionKey = "";
    var uriBase = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";
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

browser.contextMenus.create({
    id: "describe-this",
    title: "Describe This!",
    contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "describe-this") {
        if (info.srcUrl) {
            alert(processImage(info.srcUrl));
        }
    }
});

