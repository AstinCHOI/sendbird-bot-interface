# sendbird-bot-interface

Sendbird UIKit + Google Dialogflow

## Reference

https://sendbird.com/docs/chat/v3/platform-api/guides/bot-interface
https://github.com/googleapis/nodejs-dialogflow
https://pm2.keymetrics.io/ 👍 (like forever module)

## Setting

$ export GOOGLE_APPLICATION_CREDENTIALS='./agent-xxxx.json'

## secret.js

```javascript
module.exports = Object.freeze({
  ENTRYPOINT: "https://api-yyyy.sendbird.com/v3/bots",
  TOKEN: "zzzz",
  DIALOGFLOW_PROJECT_ID: "agent-xxxx",
});
```

## Demo

https://codesandbox.io/s/sendbird-bot-interface-dp0vo
