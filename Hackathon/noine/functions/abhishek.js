const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
// response.send("Hello from Firebase!");
// });

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
// Import the Dialogflow module and response creation dependencies from the 
// Actions on Google client library.
const {
dialogflow,
Permission,
Suggestions,
BasicCard,
} = require('actions-on-google');


// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});


// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
const name = conv.user.storage.userName;
if (!name) {
// Asks the user's permission to know their name, for personalization.
conv.ask(new Permission({
context: 'Hi there, to get to know you better',
permissions: 'NAME',
}));
} else {
conv.ask(`Hi again, ${name}. What would you like me to guide you through? `);
conv.ask(new Suggestions('PAN Card', 'ADHAAR', 'Patent'));
}
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
if (!permissionGranted) {
// If the user denied our request, go ahead with the conversation.
conv.ask(`Ok, no issues! What would you like me to guide you through? `);
conv.ask(new Suggestions('PAN Card', 'ADHAAR', 'Patent'));
} else {
// If the user accepted our request, store their name in
// the 'conv.user.storage' object for the duration of the conversation.
conv.user.storage.userName = conv.user.name.display;
conv.ask(`Thanks, ${conv.user.storage.userName}. What would you like me to guide you through?`);
conv.ask(new Suggestions('PAN Card', 'ADHAAR', 'Patent'));
}
});

//passport
app.intent('passport', (conv, {passport}) => {
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
    if (conv.user.storage.userName) {
    // If we collected user name previously, address them by name and use SSML
    // to embed an audio snippet in the response.
    conv.ask(`<speak> Sure, ${conv.user.storage.userName.split(' ')[0]}. What queries do you have related to passport application? </speak> `);
    conv.ask(new Suggestions('Renew', 'New'));
    } else {
    conv.ask(`Sure. What queries do you have related to passport application? `);
    conv.ask(new Suggestions('Renew', 'New'));
    }
    });
    
    app.intent('requirements', (conv, {require}) => {
    conv.ask(`What kind of requirements do you want to know about?`);
    conv.ask(new Suggestions('Tell me about address proof', 'What is Non-ECR?'));
    });
    
    app.intent('documents', (conv, {docs}) => {
    conv.ask(`These are the mandatory documents you'll require:-
    1. Proof of present address
    2. Proof of date of birth
    3. Proof of Non-ECR category. 
    Would you like further details on any of the above?`);
    conv.ask(new Suggestions('list valid address proofs', 'Non-ECR?'));
    });
    
    
    
    app.intent('issues', (conv, {issues}) => {
    conv.ask(`What kind of issues would you need my help on?`);
    conv.ask(new Suggestions());
    });
    
    app.intent('information', (conv, {information}) => {
    conv.ask('What type of information would you like to know about?');
    conv.ask(new Suggestions());
    });
    
    
    //DOB
    app.intent('documentdob', (conv) => {
    conv.ask(`These are the Main DOB Proof: 
    1) Aadhar Card
    2) Pan Card
    3) Driving License`
    , new BasicCard({
    title: 'Other DOB Proofs',
    image: {
    url: 'http://funkyimg.com/i/2LXKs.png',
    accessibilityText: 'Image alternate text',
    },
    display: 'WHITE'})
    );
    });

    app.intent('documentaddress', (conv,{address_document}) => {
        conv.ask(`These are the Main Address Proof: 
        1) Aadhar Card
        2) Voter ID
        3)Electricity Bill`, new BasicCard({
        title: 'Other Address Proofs',
        image: {
        url: 'http://funkyimg.com/i/2LXF9.png',
        accessibilityText: 'Image alternate text',
        },
        display: 'WHITE'}));
        });
        
        
        exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);