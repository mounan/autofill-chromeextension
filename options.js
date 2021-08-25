// Saves options to chrome.storage
function save_options() {
    var map = {};
    var keys = document.getElementsByClassName("key");
    var values = document.getElementsByClassName("value");
    Array.from(keys).forEach(k => {
        Array.from(values).forEach(v => {
            if (v.id == k.id) {
                map[k.value] = v.value;
            }
        });
    });
    console.log(map);
    chrome.storage.sync.set({
        map: map,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function add_entry(reload = false, v1 = '', v2 = '', id = '') {
    var key = document.createElement("input");
    var value = document.createElement("input");
    var br = document.createElement("br");
    var name = Date.now().toString();
    if (reload) {
        key.setAttribute("value", v1);
        value.setAttribute("value", v2);
        name = id;
    }

    key.setAttribute("name", 'key-' + name);
    key.setAttribute("id", name);
    key.setAttribute("class", 'key');

    key.setAttribute("type", 'text');
    key.setAttribute("style", "margin: 5px; width:100px; height:30px");
    key.setAttribute("placeholder", "key");
    value.setAttribute("name", 'value-' + name);
    value.setAttribute("class", 'value');
    value.setAttribute("type", 'text');

    value.setAttribute("id", name);
    value.setAttribute("style", "margin: 5px;width:400px; height:30px");
    value.setAttribute("placeholder", "value");


    var addone = document.getElementById('addone');
    let parent = addone.parentNode;
    parent.insertBefore(key, addone);
    parent.insertBefore(value, addone);
    parent.insertBefore(br, addone);

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        map: {}
    }, function (items) {
        const map = items.map;
        Object.keys(map).forEach((k, idx) => {
            if (k) {
                console.log(k);
                console.log(map[k]);
                add_entry(true, k, map[k], idx);
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('addone').addEventListener('click',
    add_entry);