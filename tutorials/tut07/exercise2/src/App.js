import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [org, setOrg] = React.useState('microsoft');

  fetch(`https://api.github.com/orgs/${org}`)
  .then(d => d.json())
  .then(d => console.log(d.public_repos));

  return (
    <div style={{ margin: '50px'}}>
      <input disabled="true" type="text" value={0} />
      <button type="button">&minus;</button>
      <button type="button">&#43;</button>
    </div>
  );
}

export default App;
