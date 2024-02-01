browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'increaseFontSize':
            adjustFontSize(1);
            sendResponse({response: "Font size increased"});
            break;
        case 'decreaseFontSize':
            adjustFontSize(-1);
            sendResponse({response: "Font size decreased"});
            break;
        case 'toggleDarkMode':
            toggleDarkMode();
            break;
        case 'highlightText':
            highlightKeywords(message.keyword);
            break;
        case 'removeHighlightText':
            removeHighlightKeywords();
            break;
    }
});

function adjustFontSize(delta) {
    const elements = document.querySelectorAll('body, body *');
    elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize);
        element.style.fontSize = `${fontSize + delta}px`;
    });
}

function toggleDarkMode() {
    const darkModeActive = document.body.classList.contains('dark-mode');
    darkModeActive ? removeDarkModeStyles() : applyDarkModeStyles();
}

function applyDarkModeStyles() {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('body, body *').forEach(element => {
        // Backup original styles
        element.setAttribute('data-original-color', element.style.color);
        element.setAttribute('data-original-background', element.style.backgroundColor);

        // Apply dark mode styles
        element.style.color = '#FFF';
        element.style.backgroundColor = '#000';
    });
    console.log("Dark mode styles applied");
}

function removeDarkModeStyles() {
    document.body.classList.remove('dark-mode');
    document.querySelectorAll('body, body *').forEach(element => {
        // Restore original styles
        element.style.color = element.getAttribute('data-original-color');
        element.style.backgroundColor = element.getAttribute('data-original-background');

        // Remove attributes
        element.removeAttribute('data-original-color');
        element.removeAttribute('data-original-background');
    });
    console.log("Dark mode styles removed");
}

function highlightKeywords(keyword) {
    if (!keyword.trim()) {
        console.log("No keyword provided for highlighting.");
        return;
    }
    removeHighlightKeywords();

    const regex = new RegExp(keyword, 'gi');

    document.querySelectorAll('body, body *').forEach(function(node) {
        if (['SCRIPT', 'STYLE', 'MARK'].includes(node.nodeName)) {
            return;
        }

        Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === 3 && regex.test(child.nodeValue)) { // Text node
                const frag = document.createDocumentFragment();
                let lastIdx = 0;
                child.nodeValue.replace(regex, function(match, offset) {
                    const before = document.createTextNode(child.nodeValue.slice(lastIdx, offset));
                    const highlighted = document.createElement('mark');
                    highlighted.textContent = match;
                    frag.appendChild(before);
                    frag.appendChild(highlighted);
                    lastIdx = offset + match.length;
                });
                const after = document.createTextNode(child.nodeValue.slice(lastIdx));
                frag.appendChild(after);
                node.replaceChild(frag, child);
            }
        });
    });
}

function removeHighlightKeywords() {
    const marks = document.querySelectorAll('mark');
    marks.forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        }
    });
}
