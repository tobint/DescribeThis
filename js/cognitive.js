// ParamEncoder - Requires params.js for
function CognitiveServices(controller, options) {
    var _Options = options;
    var _Controller = controller;

    function _hasPersonTag(tags) {
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

    function _call(apiUrl, subscriptionKey, sourceImageUrl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange",
            function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback(this.response);
                }
            }, false);
        try {
            xhr.open('POST', apiUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');
        } catch (err) {
            _Controller.abandon("DescribeThis! was unable to call Microsoft Cognitive Services API: " + err); // TODO: Localize
        }
    };

    function VisionAnalyze(sourceImageUrl, callback) {
        var params = {
            "visualFeatures": "Categories,Description",
            "language": "en"
        }; // TODO: Add to options page

        var subscriptionKey = _Options.visionApiKey;
        var uriBase = "https://" + _Options.visionApiRegion + ".api.cognitive.microsoft.com/vision/v1.0/analyze?";
        var url = uriBase + ParamEcoder.toQueryString(params); 

        _call(url, subscriptionKey, sourceImageUrl,
            function (response) {
                var retObj = JSON.parse(response);
                retObj.hasPerson = _hasPersonTag(retObj.description.tags);
                callback(retObj);
            }
        );
    };

    function EmotionRecognize(sourceImageUrl, callback) {
        var subscriptionKey = _Options.emotionApiKey;
        var uriBase = "https://" + _Options.emotionApiRegion + ".api.cognitive.microsoft.com/emotion/v1.0/recognize?";
        var url = uriBase;

        return _call(url, subscriptionKey, sourceImageUrl,
            function (response) {
                callback(JSON.parse(response));
            }
        );
    };

    return {
        "VisionAnalyze": VisionAnalyze,
        "EmotionRecognize": EmotionRecognize
    };

}