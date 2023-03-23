// Bring in environment secrets through dotenv
require('dotenv/config');

// Use the request module to make HTTP requests from Node
const request = require('request');

// Run the express app
const express = require('express');
const app = express();

let access_token = "";
let scopes = "";
let api_response = "";
let expires_in = "";

// Make a GET request to the '/' route to trigger the code
app.get('/', (req, res) => {

    // Request an access token using the account id associated with your app
    let url = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + process.env.accountID;

    request.post(url, (error, response, body) => {

        
        // Parse response to JSON
        body = JSON.parse(body);
        access_token = body.access_token;
        scopes = body.scope;
        expires_in = body.expires_in.toString(); //converts expires_in to string

        //Make API call to using GraphQL API to get a list of Users in your account with the requested token
        const query = `
            query {
              users(first:100) {
                edges {
                  id
                  firstName
                  lastName
                  department
                }
              }
            }
        `;

        const options = {
            'method': 'POST',
            'url': 'https://api.zoom.us/v3/graphql',
            'headers': {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({ query }, null, 2).replace(/\\n/g, '')
        };

        request(options, (error, response, body) => {
            if (error) throw new Error(error);
            api_response = JSON.stringify(JSON.parse(body), null, 2);
            // Send the API call response to the client
            res.send(`
            <select id="options" onchange="updateTextArea()">
                <option value="">Select an option:</option>
                <option value="access_token">Access Token</option>
                <option value="scopes">Scopes</option>
                <option value="api_response">API Response</option>
                
            </select>
            <br>
            <textarea id="output" rows="20" cols="50" readonly></textarea>
            <script>
                function updateTextArea() {
                    const option = document.getElementById("options").value;
                    let text = "";
                    switch (option) {
                        case "access_token":
                            text = \`Access Token: ${access_token.replace(/[`\\]/g, '\\\\$&')},\nExpires In: ${expires_in.replace(/[`\\]/g, '\\\\$&')}\`;
                            break;
                        case "scopes":
                            text = \`${scopes.replace(/[`\\]/g, '\\\\$&')}\`;
                            break;
                        case "api_response":
                            text = \`${JSON.stringify(JSON.parse(api_response), null, 2).replace(/[`\\]/g, '\\\\$&')}\`;
                            break;
                        
                        default:
                            text = "";
                    }
                    document.getElementById("output").value = text;
                }
            </script>
            `);
        });

    }).auth(process.env.clientID, process.env.clientSecret);

});

app.listen(4000, () => console.log(`GraphQL sample app is listening on Port 4000`));