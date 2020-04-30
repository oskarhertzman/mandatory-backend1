This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Load Order

### `1#`
#### npx  (npm 5.2+)

```sh
npx nodemon server.js
```
#### npm (npm 5.1 & below )
```sh
node server.js
```
**Execute in: ***/server/***** <br />

Starts the server. <br />
Open [http://localhost:8090](http://localhost:8090) to view it in the browser.

### `2#`
```sh
npm start
```
**Execute in: ***root***** <br />

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Features
  * Public & private rooms
  * Add, update & remove chat rooms (live)
  * Real-time messages
  * Error handling on missing data
  
## Tools 
   **Frontend**
   * React Hooks
   * Components by [Material UI](https://material-ui.com/) & [Material Table](https://material-table.com/#/)
   * Routing with [React Router](https://www.npmjs.com/package/react-router) 
   
   **Backend**
   * [Node.js](https://nodejs.org/en/) REST API
   * [Socket.io](https://socket.io/) integration
   * Simple .json based DB
