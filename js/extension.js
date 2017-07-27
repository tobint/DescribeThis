function Extension() {
    var _Storage = null;
    var _Options = null;
    var _Cognitive = null;
    var _Setup = false;
    var _ThisExtension = this;

    function _getOptionsCallback(settings) {
        if (settings.visionApiKey == null) {
            abandon("set options first");
        } else {
            _Options = settings;
            _Cognitive = CognitiveServices(_ThisExtension, _Options);
            _Setup = true;
        }
    }

    function abandon(message) {
        throw message; //TODO: Change to something more meaningful
    };

    function processImage(sourceImageUrl, processImageCallback) {
        var returnObj = {
            "caption": "",
            "confidence": 0,
            "people": 0,
            "emotions": []
        };

        _Cognitive.VisionAnalyze(sourceImageUrl,
            function (analyze) {

                returnObj.caption = analyze.description.captions[0].text;
                returnObj.confidence = (parseInt(analyze.description.captions[0].confidence * 1000) / 10);

                if (analyze.hasPerson) {

                    // If it's a person, get their emotion
                    _Cognitive.EmotionRecognize(sourceImageUrl, function (people) {
                        var peopleLength = people.length;

                        returnObj.people = peopleLength;

                        if (peopleLength > 0) {
                            for (var p = 0; p < peopleLength; p++) {
                                var scores = people[p].scores;
                                var items = Object.keys(scores).map(
                                    function (key) { return [key, scores[key]]; });
                                items.sort(
                                    function (first, second) { return second[1] - first[1]; });
                                var emotions = (items.slice(0, 1));
                                returnObj.emotions.push(emotions[0][0]);
                            }
                        }

                        processImageCallback(returnObj);
                    });
                }
            });
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
