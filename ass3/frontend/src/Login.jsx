import React from 'react';
import { useHistory } from 'react-router-dom';
import Api from './api';
import LoginForm from './LoginForm';

// functional component for Login
const Login = (loggedIn) => {
  const [showError, setShowError] = React.useState(false);
  const api = new Api();
  const history = useHistory();

  // method to post login results to Api
  // Api response error will set error state to be true
  // Api success will redirect to home
  const postLogin = (body) => {
    api.login(body)
      .then((result) => {
        if (result.error) {
          setShowError(true);
        } else {
          loggedIn.parentCallback(true);
          localStorage.setItem('token', result.token);
          history.push('/home');
        }
      });
  };

  return (
    <LoginForm onLoginSubmit={(body) => postLogin(body)} error={showError} />
  );
};

export default Login;
