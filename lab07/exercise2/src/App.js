import React from 'react';
import logo from './logo.svg';
import Card from './Card';
import './App.css';

let orgInputTimeout = null;

function App() {
  const [orgs, setOrgs] = React.useState('');
  const [orgInput, setOrgInput] = React.useState('');
  const [repos, setRepos] = React.useState(0);
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    console.log(orgs);
    if (orgs != "") {
      const results = fetchData(orgs);
      results.then((values) => {
        for (let val of values) {
          console.log(val)
          let newCards = [ ... cards];
          console.log(newCards);
          newCards.push(<Card name={val.name} url={val.url} src={val.avatar_url}/>)
          setCards(newCards);
          console.log(cards);
        }
      })
    }
    
    
  }, [orgs]);

  const updateOrg = e => {
    setOrgInput(e.target.value);
    clearTimeout(orgInputTimeout);
    orgInputTimeout = setTimeout(() => {
      setOrgs(e.target.value)
    }, 1000);
  }

  return (
    <div>
      <label>username: </label>
      <input type="text" name="usernames" onChange={updateOrg}/>
      {console.log(cards)}
      <ul>
        {cards.map(card => (
          <li key={card}>{card}</li>
        ))}
      </ul>
    </div>
  );
}

async function fetchData(vals) {
  let results = [];
  const names = vals.split(',');
  for (let name of names) {
    const response = await fetch(`https://api.github.com/users/${name}`)
    const repos = await response.json();
    results.push(repos);
  }
  

  return results;
}

export default App;
