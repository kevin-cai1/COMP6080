import React from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

// functional component for register route
const Register = (loggedIn) => {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const api = new Api();
  const history = useHistory();
  const classes = styles();

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = JSON.stringify({
      email,
      name,
      password,
    });
    api.register(body)
      .then((result) => {
        if (result.token) {
          loggedIn.parentCallback(true);
          localStorage.setItem('token', result.token);
          history.push('/home');
        }
      });
  };
  return (
    <div className="Main-content">
      <Grid item xs={12} sm={10} md={7} lg={5}>
        <Paper className={classes.formPaper}>
          <h1 className="form-title">Register</h1>
          <form className="App-form" onSubmit={handleSubmit}>
            <TextField name="email" label="Email" variant="outlined" className={classes.inputField} value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField name="name" label="Name" variant="outlined" className={classes.inputField} value={name} onChange={(e) => setName(e.target.value)} />
            <TextField name="password" label="Password" variant="outlined" className={classes.inputField} value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" className={classes.formButton} type="submit" value="Submit">
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
};

export default Register;
