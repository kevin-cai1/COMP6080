import React from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

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

// functional component for Login Form
// loginForm.error - boolean denoting whether there is a login error
// loginForm.onLoginSubmit - parent callback that passes email and password
const LoginForm = (loginForm) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const classes = styles();

  // method to submit login form
  const submitLogin = (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      email,
      password,
    });
    loginForm.onLoginSubmit(body);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="Main-content">
      <Grid item xs={12} sm={10} md={7} lg={5}>
        { loginForm.error && <Alert severity="error">Please enter a valid username and password</Alert> }
        <Paper className={classes.formPaper}>
          <h1 className="form-title">Login</h1>
          <form className="App-form" onSubmit={submitLogin}>
            <TextField name="email" label="Email" variant="outlined" className={classes.inputField} value={email} onChange={(e) => setEmail(e.target.value)} />
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

export default LoginForm;
