document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('increase-font').addEventListener('click', () => {
        sendMessageToContent({ action: 'increaseFontSize' });
    });

    document.getElementById('decrease-font').addEventListener('click', () => {
        sendMessageToContent({ action: 'decreaseFontSize' });
    });

    document.getElementById('dark-mode-toggle').addEventListener('change', (event) => {
        sendMessageToContent({ action: 'toggleDarkMode', value: event.target.checked });
    });

    document.getElementById('highlight-button').addEventListener('click', () => {
        const keyword = document.getElementById('highlight-keyword').value;
        sendMessageToContent({ action: 'highlightText', keyword: keyword });
    });
    
    function sendMessageToContent(message) {
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, message);
        });
    }
});
