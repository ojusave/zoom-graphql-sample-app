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
            
            //Make API call to Users/Me with the requested token
            var options = {
                'method': 'GET',
                'url': 'https://api.zoom.us/v2/users/me',
                'headers': {
                  'Authorization': `Bearer ${access_token}`
                },
                'json' : true
              };
              request(options, function (error, response) {
                if (error) throw new Error(error);
                //Printing the response in the console
                console.log(response.body);
              });

        }).auth(process.env.clientID, process.env.clientSecret);
    })

app.listen(4000, () => console.log(`Server to Server Sample app listening at PORT: 4000`))