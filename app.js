'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const MIRROR_URL = '';
const WELCOME_INTENT = 'input.welcome';
const CHECK_IN = 'check.in';
const CHECK_OUT = 'check.out';
const QUIT_INTENT = 'quit';
const MORE_HELP = 'anything.else.yes';
const CHECK_MIRROR = 'check.mirror';
const MIRROR_URL = '';

// [START SillyNameMaker]
app.post('/', function (req, res) {
    const assistant = new Assistant({request: req, response: res});
    console.log('Request headers: ' + JSON.stringify(req.headers));
    console.log('Request body: ' + JSON.stringify(req.body));

    // Make a silly name
    function makeName(assistant) {
        let number = assistant.getArgument(NUMBER_ARGUMENT);
        let color = assistant.getArgument(COLOR_ARGUMENT);
        assistant.tell('Alright, your silly name is ' +
            color + ' ' + number +
            '! I hope you like it a lot! See you next time.');
    }

    function welcomeIntent(assistant) {
        assistant.ask('Welcome to this easy program, how may I help you?');
    }

    function checkInIntent(assistant) {
        let name = assistant.getArgument('name');
        assistant.data.name = name;
        assistant.setContext('anything_else');
        assistant.ask('Ok ' + name + ', you are now checked in! Is there anything else I can help you with? Yes or no?')
    }

    function checkOutIntent(assistant) {
        //ToDO
        assistant.setContext('anything_else');
        assistant.ask('Alright ' + assistant.data.name + ', you are now checked out. Need anything else?');
    }

    function quit(assistant) {
        assistant.tell('Ok, have a nice day! Just say: Talk to assistant if you want to make contact again');
    }

    function moreHelp(assistant) {
        let name = assistant.data.name;
        assistant.ask('What more would you like to do ' + name + '?');
    }

    function checkMirror(assistant) {
        //Todo
        //Kolla upp vem det är som är framför spegeln genom att göra anrop till MM
        //1. Hämta Mirror URL från databasen
        //2. Gör en GET-request till spegeln med URL + endpoint /id_face
        //3.
        if(!MIRROR_URL) {
            assistant.tell('No mirror URL found');
        } else {
            assistant.tell('Mirror is on URL: ' + MIRROR_URL);
        }

    }

    let actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    actionMap.set(CHECK_IN, checkInIntent);
    actionMap.set(QUIT_INTENT, quit);
    actionMap.set(MORE_HELP, moreHelp);
    actionMap.set(CHECK_OUT, checkOutIntent);
    actionMap.set(CHECK_MIRROR, checkMirror);

    assistant.handleRequest(actionMap);
});

//when MM server starts, it sends a POST with it's URL. This shall be stored in database
app.post('/mirror', function (req, res) {
    let name = req.body.name,
         url = req.body.url;
    console.log('MIRROR URL IS: ' + url);
    //ToDO: Add the URL into database

});

if (module === require.main) {
    // [START server]
    // Start the server
    let server = app.listen(process.env.PORT || 8080, function () {
        let port = server.address().port;
        console.log('App listening on port %s', port);
    });
    // [END server]
}

module.exports = app;
