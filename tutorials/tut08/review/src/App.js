import React, { useState } from 'react';
import Card from './Card';
import './App.css';

let intervalId;
const API_URL = "https://api.github.com/users"

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState([]);

  const handleChange = event => {
    clearTimeout(intervalId);
    setSearchTerm(event.target.value)
    intervalId = setTimeout(async () => {
      const users = event.target.value.split(",").map(term => term.trim()).filter(term => !!term);
      const responses = await Promise.all(users.map(user => fetch(`${API_URL}/${user}`)));
      const data = await Promise.all(responses.map(response => response.json()))
      setCards(data.map(({ avatar_url, name, url }, index) => <Card key={index} avatar_url={avatar_url} name={name} url={url} />))
    }, 500)
  }

  return <>
      <input type="text" onChange={handleChange} value={searchTerm} placeholder="github usernames" />
      {cards}
    </>
}

export default App;

