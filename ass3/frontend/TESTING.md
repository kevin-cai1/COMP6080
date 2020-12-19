# Testing Instructions
All testing can be run through `yarn test`

The database should be reset and running before each test run with `npm run reset` and `npm run backend`

Main app needs to be running for cypress tests. Can be run with `yarn start` in a separate terminal

UI testing files can be found at `frontend/cypress/integration/tests/admin-tests.js`  
Component testing files are all found at `/frontend/src/*.test.jsx`

## Tests
1. Dashcard
2. Login
3. Option