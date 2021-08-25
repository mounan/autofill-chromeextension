// Initialize button with user's preferred color
let enableAutoFill = document.getElementById("enableAutoFill");

// When the button is clicked, inject setPageBackgroundColor into current page
enableAutoFill.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: autoFill,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function autoFill() {
    chrome.storage.sync.get("map", ({ map }) => {

        function getInput(tag, layer = 0) {
            if (layer > 3) {
                return null;
            }
            if (tag.parentElement.querySelector('input')) {
                return tag.parentElement.querySelector('input');
            }
            return getInput(tag.parentElement, layer + 1);
        }

        Object.keys(map).forEach(k => {
            // console.log(k);
            var xpath = "//span[contains(text(),'" + k + "')]|div[contains(text(),'" + k + "')]";
            var iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

            if (iterator) {
                var thisNode = iterator.iterateNext();
                while (thisNode) {
                    if (getInput(thisNode)) {
                        const el = getInput(thisNode);
                        el.focus();
                        el.select();
                        if (!document.execCommand('insertText', false, map[k])) {
                            el.value = map[k];
                        }
                    }
                    try {
                        thisNode = iterator.iterateNext();
                    } catch (error) {
                        break;
                    }
                }
            }
        });

    });
}

