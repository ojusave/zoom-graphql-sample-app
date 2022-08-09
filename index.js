// Bring in environment secrets through dotenv
require('dotenv/config')

// Use the request module to make HTTP requests from Node
const request = require('request')

// Run the express app
const express = require('express')
const app = express()

let access_token = "";
let scopes = "";

app.get('/', (req, res) => {

        // Request an access token using the account id associated with your app
        let url = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + process.env.accountID;
        
        request.post(url, (error, response, body) => {
           
            // Parse response to JSON
            body = JSON.parse(body);
            access_token = body.access_token;
            scopes = body.scope

            // Logs your access token and scopes in console
            console.log(`access_token: ${access_token}`);
            console.log(`scope: ${scopes}`)

        }).auth(process.env.clientID, process.env.clientSecret);
    })

app.listen(4000, () => console.log(`Server to Server Sample app listening at PORT: 4000`))