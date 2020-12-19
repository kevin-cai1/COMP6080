import React from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Api from './api';

const styles = makeStyles({
  inputField: {
    margin: '3%',
  },
  formPaper: {
    'text-align': 'center',
    margin: '50px 0 10px 0',
    padding: '5% 10% 13% 10%',
  },
  formButton: {
    width: '50%',
    margin: '3%',
    'align-self': 'center',
  },
});

// functional component to render join game page
const PlayJoin = (params) => {
  const [gameId, setGameId] = React.useState('');
  const [autofill, setAutofill] = React.useState(false);
  const [name, setName] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const api = new Api();
  const history = useHistory();
  const classes = styles();

  // method to autofill gameId
  React.useEffect(() => {
    if (params.match.params.gameID) {
      setGameId(params.match.params.gameID);
      setAutofill(true);
    }
  }, [params]);

  // method to handle player submission of join details
  // calls the joinGame Api
  // redirects user to game if join is successful
  const submitJoin = (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      name,
    });
    api.joinGame(gameId, body)
      .then((result) => {
        if (result.error) {
          setShowError(true);
          setGameId('');
          setName('');
        } else {
          localStorage.setItem('playerName', name);
          localStorage.setItem('playerId', result.playerId);
          history.push('/play');
        }
      });
  };
  return (
    <div className="Main-content">
      <Grid item xs={12} sm={10} md={7} lg={5}>
        { showError && <Alert severity="error">Please enter a valid game ID and name</Alert> }
        <Paper className={classes.formPaper}>
          <h1 className="form-title">Join a game!</h1>
          <form className="App-form" onSubmit={submitJoin}>
            <TextField
              label="Game ID"
              variant="outlined"
              className={classes.inputField}
              disabled={autofill}
              type="number"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="e.g. 426530100"
            />
            <TextField
              label="Your Name"
              variant="outlined"
              className={classes.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <Button variant="contained" color="primary" className={classes.formButton} type="submit" value="Submit">
              Join!
            </Button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

export default PlayJoin;
