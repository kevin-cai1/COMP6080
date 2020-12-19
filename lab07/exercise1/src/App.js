import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [org, setOrg] = React.useState(0);

  React.useEffect(() => {
    fetchReposJSON();
    /* fetch(`https://api.github.com/orgs/microsoft`)
    .then(d => d.json())
    .then(d => setOrg(d.public_repos))
    .catch(err => console.log(err)); */
    
  }, []);

  async function fetchReposJSON() {
    const response = await fetch(`https://api.github.com/orgs/microsoft`)
    const repos = await response.json();
    setOrg(repos.public_repos);
  }

  return (
    <div style={{ margin: '50px'}}>
      <input disabled="true" type="text" value={org} />
    </div>
  );
}




export default App;
