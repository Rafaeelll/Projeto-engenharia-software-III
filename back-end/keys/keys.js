const WebPush = require('web-push');

function createKeys() {
    return WebPush.generateVAPIDKeys();
}

console.log(createKeys());
