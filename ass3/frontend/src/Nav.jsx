import React from 'react';
import './App.css';
import {
  useHistory,
} from 'react-router-dom';
import {
  AppBar, Toolbar, Button, Typography,
} from '@material-ui/core';
import GamesIcon from '@material-ui/icons/Games';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Api from './api';

const styles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

// functional component for the Nav bar
// app.loggedIn - boolean value denoting whether user has logged in
const Nav = (app) => {
  const classes = styles();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const api = new Api();
  const history = useHistory();

  // sets new loggedIn value if loggedIn state has changed
  React.useEffect(() => {
    setLoggedIn(app.loggedIn);
  }, [app.loggedIn]);

  // method to handle second nav button click
  // redirects to different pages depending on if user is logged in
  const handleNavButtonTwo = () => {
    if (loggedIn) {
      history.push('/home');
    } else {
      history.push('/login');
    }
  };

  // method to handle third nav button click
  // redirects to different pages depending on if user is logged in
  const handleNavButtonThree = () => {
    if (loggedIn) {
      api.logout()
        .then(() => {
          localStorage.removeItem('token');
          setLoggedIn(false);
          history.push('/login');
        });
    } else {
      history.push('/register');
    }
  };

  return (
    <header>
      <nav>
        <AppBar position="static" color="primary">
          <Toolbar>
            <GamesIcon />
            <Typography variant="h6" className={classes.title}>
              BigBrain
            </Typography>
            <Button color="secondary" variant="contained" onClick={() => history.push('/join')}>Join Game</Button>
            <Button color="inherit" onClick={handleNavButtonTwo}>{loggedIn ? 'Home' : 'Login'}</Button>
            <Button name="register" color="inherit" onClick={handleNavButtonThree}>{loggedIn ? 'Logout' : 'Register'}</Button>
          </Toolbar>
        </AppBar>
      </nav>
    </header>
  );
};

export default Nav;
