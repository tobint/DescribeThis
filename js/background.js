browser.browserAction.onClicked.addListener(function () {

})


function processImage(sourceImageUrl) {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = "";

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?";


    var returnValue = "";
    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resp = JSON.parse(this.response);
            returnValue = resp.description.captions[0].text;
        }
    });
    try {
        var url = uriBase + "visualFeatures=Categories%2CDescription&language=en";
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        xhr.send('{"url": ' + '"' + sourceImageUrl + '"}');
    } catch(err) {
        returnValue = err;
    } 
    while (returnValue == "") { sleep(100); }
    return returnValue;
};


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

