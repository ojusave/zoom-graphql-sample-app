import env from 'dotenv';
import express from 'express';
import qs from 'query-string';
import axios from 'axios';

env.config();

const app = express();

const ZOOM_OAUTH_BASE_URL = 'https://zoom.us/oauth/token';
const ZOOM_GRAPHQL_BASE_URL = 'https://api.zoom.us/v3/graphql';

const QUERY = `query {
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
const MUTATION = `mutation createUser {
  createUser(
    input: {
      action: CUST_CREATE,
      userInfo: {
        email: "test+4@test.zoom.us", 
        firstName: "Test",
        lastName: "User 2", 
        type: Basic
      }
    }
  ) {
    email
    id
    firstName
    lastName
    type
  }
}
`;

const getZoomAccessToken = async () => {
  try {
    const { accountID, clientID, clientSecret } = process.env;
    const request = await axios.post(
      ZOOM_OAUTH_BASE_URL,
      qs.stringify({ grant_type: 'account_credentials', account_id: accountID }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`,
        },
      },
    );

    const { access_token, expires_in, scope: scopes } = await request.data;

    return { access_token, expires_in, error: null, scopes };
  } catch (error) {
    return { access_token: null, expires_in: null, error, scopes };
  }
};

app.get('/', async (req, res) => {
  try {
    const { access_token, expires_in, error, scopes } = await getZoomAccessToken();

    if (error) return res.json(error);

    const headerConfig = {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "application/json",
      },
    };

    const apiResponse = await axios.post(ZOOM_GRAPHQL_BASE_URL, { query: QUERY }, headerConfig);
    const mutationResponse = await axios.post(ZOOM_GRAPHQL_BASE_URL, { query: MUTATION }, headerConfig);
    const responseData = await apiResponse.data;
    const mutationData = await mutationResponse.data;

    res.setHeader('Content-Type', 'text/html');

    res.send(`
        <select id="options" onchange="updateTextArea()">
            <option value="">Select an option:</option>
            <option value="access_token">Access Token</option>
            <option value="scopes">Scopes</option>
            <option value="api_response">API Response</option>
            <option value="mutation_response">Mutation Response </option>
            
        </select>
        <br>
        <textarea id="output" rows="50" cols="150" readonly></textarea>
        <script>
            function updateTextArea() {
                const option = document.getElementById("options").value;
                let text = "";
                switch (option) {
                    case "access_token":
                        text = \`Access Token: ${access_token},\nExpires In: ${expires_in}\`;
                        break;
                    case "scopes":
                        text = \`${JSON.stringify(scopes, null, 2)}\`;
                        break;
                    case "api_response":
                        text = \`${JSON.stringify(responseData, null, 2)}\`;
                        break;
                    case "mutation_response":
                        text = \`${JSON.stringify(mutationData, null, 2)}\`;
                        break;
                    default:
                        text = "";
                }
                document.getElementById("output").value = text;
            }
        </script>
    `);
  } catch (e) {
    res.json(e);
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`GraphQL sample app listening on port ${port}`));
