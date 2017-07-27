var images = document.images;

for (var image in images) {
    images[image].addEventListener("mouseover", function (e) {  
        browser.runtime.sendMessage(e.currentTarget.src);
    }, false);
}

/*
var anchors = document.getElementsByTagName("a");
for (var anchor in anchors) {
    var backgroundImage = anchors[anchor].style.backgroundImage;

    if (backgroundImage != "") {
        anchors[anchor].addEventListener("mouseover", function (e) {
            browser.runtime.sendMessage(backgroundImage);
        }, false);
    }
}
*/