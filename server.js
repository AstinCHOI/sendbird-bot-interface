const secret = require('./secret');
const ENTRYPOINT = secret.ENTRYPOINT;
const TOKEN = secret.TOKEN;
const DIALOGFLOW_PROJECT_ID = secret.DIALOGFLOW_PROJECT_ID;

const axios = require('axios');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');


app.get('/', async (req, res) => { 
  res.send(`Welcome to Sendbird Bot Interface`);
});

app.post('/callback', express.json(), async (req, res) => {
  const { message, bot, channel } = req.body;
  if (message && bot && channel) {
    const reply = await runDialogflow(message.text);   
    
    // https://sendbird.com/docs/chat/v3/platform-api/guides/bot-interface#2-send-a-bot-s-message  
    const params = {
      channel_url: channel.channel_url,
      message: reply
    }

    await axios.post(ENTRYPOINT + '/' + bot.bot_userid + '/send', params, {
      headers: {
        'Content-Type': 'application/json', 
        'Api-Token': TOKEN,
      },
    });

    res.status(200).json({
      message: 'Response from DialogFlow: ' + params.message
    });

  } else {
    res.status(400).json({
      message: 'Wrong format'
  });
  }
});

/** 
 * https://github.com/googleapis/nodejs-dialogflow
 * Send a query to the dialogflow agent, and return the query result.
 */
async function runDialogflow(message) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(DIALOGFLOW_PROJECT_ID, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText;
}

app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(8000, () => console.log('Sendbird bot interface port: 8000'));

// const ngrok = require('ngrok');
// (async function() {
//   const url = await ngrok.connect(8000);
//   console.log(url);
// })();