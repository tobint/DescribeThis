function ExtensionStorage(extension) {
    var _Extension = extension;

    /*
     * Obtaining API Subscription Keys
     * https://docs.microsoft.com/en-us/azure/cognitive-services/Computer-vision/vision-api-how-to-topics/howtosubscribe
     * View Your keys:
     * https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/
     */
    function getAllOptionSettings(callback) {
        if (callback === null) {
            _Extension.abandon("Callback for getAllOptionSettings is null"); // TODO: Localize
        }

        let settings = browser.storage.sync.get(
            {
                "visionApiRegion": "westcentralus",
                "visionApiKey": "",
                "emotionApiRegion": "westus",
                "emotionApiKey": ""
            }, callback);
    };

    function setAllOptionSettings(settings, callback) {
        if (settings === null) {
            _Extension.abandon("Settings for setAllOptionSettings is null"); //TODO: Localize
        }
        if (callback === null) {
            _Extension.abandon("Callback for setAllOptionSettings is null"); //TODO: Localize
        }


        let settingReturn = browser.storage.sync.set(
            settings,
            callback);
    };

    return {
        "getAllOptionSettings": getAllOptionSettings,
        "setAllOptionSettings": setAllOptionSettings
    };

};