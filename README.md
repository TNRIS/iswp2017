# iswp2017

Web application for the 2017 Texas State Water Plan.

## Developing

### Prerequesites:

Install node >= 0.12.0 and npm >= 3.3.3.

**Note** - versions 5 and 6 of Node will not work. Use v0.12 and then update npm (v3.10.8) for proper package installations.

Install AWS Command Line Interface and configure with AWS credentials (IAM Key, Secret, Region). http://docs.aws.amazon.com/cli/latest/userguide/installing.html

Install babel: `npm install -g babel@5`

Download a copy of the water plan data sqlite3 database (https://s3.amazonaws.com/tnris-misc/iswp/2017/cache.db) and place it at `/app/db/cache.db`.

#### Webfont

Download a copy of the licensed web font we are using from S3 at tnris-misc/iswp/2017/gill-sans.zip and unzip the contents to app/public/static/webfonts/ (this requires credentials to our S3 bucket). If you are using a fork of this you can just remove the custom font usage in `layout.swig` and in `main.scss`.

This command should do it for you (requires aws cli and credentials): `aws s3 cp s3://tnris-misc/iswp/2017/gill-sans.zip gill-sans.zip; unzip gill-sans.zip -d app/public/static/webfonts/; rm gill-sans.zip`

#### Custom D3 Build

We are using a custom [D3](http://d3js.org/) build to cut down on code size. To make a new custom build, see instructions in `d3_build/README.md`.

### Developing

`npm run dev-start` in a terminal to continuously build client-side scripts and css and serve the application

`npm test` to run the test scripts

Note that this application uses a `npm-shrinkwrap.json` file to freeze npm dependencies. If you'd like to update packages, you will have to do so manually and then re-run `npm shrinkwrap`.

### Deploying

#### Production

1. Set `NODE_ENV` to "production"
2. Run `npm install --production` to install dependencies
3. Run `npm run webpack` to build production client side assets
4. Run the application with `npm start`. You can optionally set the `APP_PORT` environment variable to specify the port to listen to, otherwise 3333 will be used.

#### Staging

You can also build and run the app with `NODE_ENV` set to "staging" to make a version that serves a non-indexed robots.txt and does not use the production Google Analytics code. Otherwise follow the Production steps from above.
