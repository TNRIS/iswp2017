# iswp2017

**Currently Under Development**

Web application for the DRAFT 2017 Texas State Water Plan.

## Developing

### Prerequesites:

Install node >= 0.12.0 and npm >= 3.3.3

Install babel: `npm install -g babel@5`

Download a copy of the water plan data sqlite3 database (PROVISIONAL DATA: https://s3.amazonaws.com/tnris-misc/iswp/2017/cache.db) and place it at `/app/db/cache.db`.

#### Webfont

Download a copy of the licensed web font we are using from S3 at tnris-misc/iswp/2017/gill-sans.zip and unzip the contents to app/public/static/webfonts/ (this requires credentials to our S3 bucket). If you are using a fork of this you can just remove the custom font usage in `layout.swig` and in `main.scss`.

This command should do it for you (requires aws cli and credentials): `aws s3 cp s3://tnris-misc/iswp/2017/gill-sans.zip gill-sans.zip; unzip gill-sans.zip -d app/public/static/webfonts/; rm gill-sans.zip`

#### Custom D3 Build

We are using a custom [D3](http://d3js.org/) build to cut down on code size. To make a new custom build, see instructions in `d3_build/README.md`.

### Running Development Server

`npm run dev-webpack` in one terminal to continuously build client-side scripts and css

`npm run dev-server` in another terminal to run the development web server

`npm test` to run the test scripts

## Technologies Used

* React with Alt for the client-side application
* HapiJS on the server side
* Babel for ES2015
