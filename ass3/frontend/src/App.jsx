import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Nav from './Nav';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import EditGame from './EditGame';
import EditQuestion from './EditQuestion';
import PlayJoin from './PlayJoin';
import Play from './Play';
import AdminResults from './AdminResults';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#800A39',
    },
    secondary: {
      main: '#9e6789',
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = React.useState(localStorage.getItem('token'));

  // callback function for when logged in state is changed
  // sets new loggedIn state
  const callbackFunction = (loggedInValue) => {
    setLoggedIn(loggedInValue);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Nav loggedIn={loggedIn} />
        <main className="main">
          <Switch>
            <Redirect exact from="/" to={loggedIn ? '/home' : 'login'} />
            <Route path="/join/:gameID?" component={PlayJoin} />
            <Route path="/home" component={Dashboard} />
            <Route
              path="/login"
              component={() => <Login parentCallback={callbackFunction} />}
            />
            <Route
              path="/register"
              component={() => <Register parentCallback={callbackFunction} />}
            />
            <Route exact path="/game/:quizID/:id/results" component={AdminResults} />
            <Route exact path="/edit/game/:id" component={EditGame} />
            <Route exact path="/edit/game/:id/:question" component={EditQuestion} />
            <Route exact path="/play" component={Play} />
          </Switch>
        </main>
      </BrowserRouter>
      <footer className="footer">
        <p>Bigbrain 2020</p>
      </footer>
    </MuiThemeProvider>
  );
}

export default App;
