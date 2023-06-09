   
    This is a sample app that first generates a server to server OAuth token in Zoom and then uses the token to make a GraphQL API call.
    - Clone or download the repository to your local machine.
    - Open a terminal and navigate to the project directory.
    - Run npm install to install the required dependencies.
    - Create a .env file in the root directory of the project.
    - In the .env file, add your Zoom API credentials in the format KEY=VALUE. Add your accountID, clientID, and clientSecret credentials to the .env file.
    - Save and close the .env file.
    - In the terminal, run 'node index.js' to start the server.
    - Open a web browser and navigate to http://localhost:4000.
    - The app will request an access token using the account_id associated with your app.
    - The app will make an API call to Zoom's GraphQL API to retrieve user data.
    - The app will display a dropdown list with three options: "Access Token", "Scopes", and "API Response".
    - When an option is selected, the app will display the relevant information in a textarea element below the dropdown list.
    - To exit the application, press ctrl + C in the terminal to stop the server.
