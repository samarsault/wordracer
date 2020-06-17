# wordracer

Quick prototype for a typing game

## Requirements
- Node
- MongoDB

## Installation
We need to build the react app and add an `env` variable for the database URI.

```
$ git clone https://github.com/thelehhman/wordracer/blob/master/server.js
$ cd build && npm i && npm run build && cd ..
$ npm i
$ DB=<MongoDB databaseURI> npm start
```
The app should be live at http://localhost:8000.

An example of MongodB uri is mongodb://localhost:27017/word-race
