# Server to Server OAuth request access token
Script to request an access token to Zoom OAuth endpoint. 

## Installation

`git clone https://github.com/elisalevet/server2server`

## Setup

1. Enter project directory

`cd server2server`

2. Install project dependencies

`npm install`

3.  Create .env file and add your Account ID, Client ID and Client Secret associated with your Server-to-Server OAuth app from your Zoom Marketplace.

```bash
accountID=
clientID=
clientSecret=
```

## Usage

`node token.js`

Your Zoom JWT token should be printed in your console/terminal as well as the scopes associated with the same

`rm .env`

`node token.js`
