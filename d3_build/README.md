
# d3.custom.js

This folder contains the necessary files to make a custom build of D3 using [`smash`](https://github.com/mbostock/smash/wiki). We use a custom build to cut down on our final bundle size for the iswp2017 application.

## Building

1) Install node dependencies: `npm install`
2) Run make: `make` This will also copy the output file to `app/public/src/vendor/js/d3.custom.js`

## Adding Additional D3 Components

Follow the guide at https://github.com/mbostock/smash/wiki to add additional pieces of D3.
This should just involve modifying the `LIBRARY_FILES` inside of the `Makefile`.