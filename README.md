# iswp2017

** Currently Under Development **

Web application for the 2017 Texas State Water Plan.

## Developing

### Prerequesites:

Install node >= 0.12.0 and npm >= 3.3.3

Install babel: `npm install -g babel`

Download a copy of the water plan data sqlite3 database and place it at `/app/db/cache.db`.

### Running Development Server

`npm run dev-webpack` in one terminal to continuously build client-side scripts and css

`npm run dev-server` in another terminal to run the development web server

`npm test` to run the test scripts

## Technologies Used

* React with Alt for the client-side application
* HapiJS on the server side
* Babel for ES2015