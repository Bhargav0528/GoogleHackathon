// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
       dialogflow,
       Permission,
       Suggestions,
       BasicCard,
       Carousel
    } = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('Default Welcome Intent', (conv) => {
    const name = conv.user.storage.userName;
if (!name) {
// Asks the user's permission to know their name, for personalization.
conv.ask(new Permission({
context: 'Hi Mishraji at your service!',
permissions: 'NAME',
}));
} else {
    conv.ask(`<speak> <audio src="https://s0.vocaroo.com/media/download_temp/Vocaroo_s0pUCICEfpGU.mp3"></audio>.Hello Again ${name}, What can I help you with today and when you are done with my services then just say "Mishra Leave me Alone!"</speak>`);
conv.ask(new Suggestions('Passport', 'Company'));
}


});
// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
if (!permissionGranted) {
// If the user denied our request, go ahead with the conversation.
conv.ask(`Fine I can manage without that. Generally Mishras don't do much, but I can help you with Passport Application and Company Setup. If you are done with my services then just say "Mishra Leave me Alone!"`);
conv.ask(new Suggestions('Passport', 'Company'));
} else {
// If the user accepted our request, store their name in
// the 'conv.user.storage' object for the duration of the conversation.
conv.user.storage.userName = conv.user.name.display;
conv.ask(`<speak> <audio src="https://s0.vocaroo.com/media/download_temp/Vocaroo_s0pUCICEfpGU.mp3"></audio>Namaste, ${conv.user.storage.userName}. Generally Mishras don't do much, but I can help you with Passport Application and Company Setup? If you are done with my services then just say "Mishra Leave me Alone!"</speak>`);
conv.ask(new Suggestions('Passport', 'Company'));
}
});

// DOB
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

app.intent('documentaddress', (conv,{address_document, address_document1}) => {
    if (address_document1.length!=0)
    {

    conv.ask(`Sure Beta, You can try these other documents `, new BasicCard({
        title: 'Other Address Proofs',
        image: {
        url: 'http://funkyimg.com/i/2LXF9.png',
        accessibilityText: 'Image alternate text',
        },
        display: 'WHITE'}));
    }
    else
    {
    conv.ask(`These are the Main Address Proofs: 
    1) Aadhar Card
    2) Voter ID
    3)Electricity Bill`, new BasicCard({
    title: 'Other Address Proofs',
    image: {
    url: 'http://funkyimg.com/i/2LXF9.png',
    accessibilityText: 'Image alternate text',
    },
    display: 'WHITE'}));
}
    });



const passportCarousel = ()=>{
    const carousel = new Carousel({
        items: {
            'Issues': {
                    title: 'Issues',
                    image: {
                    url: 'https://www.logolynx.com/images/logolynx/7d/7d2edbb78711d511a214caacd2ec83c6.jpeg',
                    accessibilityText: 'Issues',
                    },
                    display: 'WHITE'},

        'requirements': {
            title: 'Requirements',
            image: {
            url: 'https://www.pst.ifi.lmu.de/~stoerrle/RED/images/red.png',
            accessibilityText: 'Requirements',
            },
            display: 'WHITE'},
          'information': {
                title: 'Information',
                image: {
                url: 'https://www.logolynx.com/images/logolynx/9c/9c73792d3e85a72f8dacdce09db31c1d.png',
                accessibilityText: 'Information',
                },
                display: 'WHITE'},
            },
        });
        return carousel;
};
// passport
app.intent('passport', (conv, {passport}) => {
if (conv.user.storage.userName) {
// If we collected user name previously, address them by name and use SSML
// to embed an audio snippet in the response.
conv.ask(`Sure, ${conv.user.storage.userName.split(' ')[0]}. I can guide you with what you require, any issues or information regarding passport applications`);
conv.ask(new Suggestions('Issues', 'Requirements'));
} else {
conv.ask(`Sure. I can guide you with what you require, any issues or information regarding passport applications.`);
conv.ask(new Suggestions('Issues', 'Requirements'));
}
return conv.ask(passportCarousel());
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


app.intent('actions_intent_NO_INPUT', (conv) => {
    // Use the number of reprompts to vary response
    const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
    if (repromptCount === 0) {
    conv.ask('What services do you need? ');
    } else if (repromptCount === 1) {
    conv.ask(`Please say the services you require`);
    } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's ` +
    `try this again later. Goodbye Beta.`);
    }
    });

app.intent('issues', (conv, {issues}) => {
conv.ask(`What kind of issues would you need my help on?`);
conv.ask(new Suggestions('Passport Denied', 'ID Proof Lost'));
});

app.intent('mishra_out', (conv) => {
    return conv.ask(`<speak> <audio src="https://actions.google.com/sounds/v1/human_voices/male_chuckling.ogg"></audio>I hope I was able to help you. Mishra Out!</speak>`);
    });

app.intent('information', (conv, {information}) => {
conv.ask('What type of information would you like to know about?');
conv.ask(new Suggestions('Renewal', 'New Passport'));
});
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
