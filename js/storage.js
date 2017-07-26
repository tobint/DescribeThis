/* Type:        ExtensionStorage
 * Description: Encapsulates storage control for the extension
 * Params:
 *              # controller - Any object with an 'abandon' function taking a single string argument
 * Note:        controller.abandon is called when an unrecoverable error occurs in ExtensionStorage.
 */
function ExtensionStorage(controller) {
    var _Controller = controller;

    /*
     * Obtaining API Subscription Keys
     * https://docs.microsoft.com/en-us/azure/cognitive-services/Computer-vision/vision-api-how-to-topics/howtosubscribe
     * View Your keys:
     * https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/
     */
    function getAllOptionSettings(callback) {
        if (callback === null) {
            _Controller.abandon("callback for getAllOptionSettings is null"); // TODO: Localize
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
            _Controller.abandon("settings for setAllOptionSettings is null"); //TODO: Localize
        }
        if (callback === null) {
            _Controller.abandon("callback for setAllOptionSettings is null"); //TODO: Localize
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