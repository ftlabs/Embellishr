# FT Labs - Embellishr

Interal application designed to help with the 'Word of the Year' feature.
## Installation/Dev

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm start
```

In another tab, run the following command to have webpack watch the client files. Is necessary, otherwise the app will fail.

```sh
$ npm run client-dev
```

## Configuration

Embellishr requires the following env params:

* CAPI_KEY=... # to allow access to the Content and Search APIs
* KEEN_KEY=... # to allow access to the latest search terms
* TOKEN=...    # to allow the APIs to be used from outside the FT network and SSO
* PORT=...     # auto-set by Heroku, but needs to be set manually when run from cmd line
