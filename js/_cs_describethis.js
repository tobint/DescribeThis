var images = document.images;

for (var image in images) {
    images[image].addEventListener("mouseover", function (e) {
        // alert(e.currentTarget.src);
        
        browser.runtime.sendMessage(e.currentTarget.src);
    }, false);
}