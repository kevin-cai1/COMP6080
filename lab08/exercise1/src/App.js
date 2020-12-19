import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import './App.css';

function App() {

  const [name, setName] = React.useState([]);
  const [allNames, setAllNames] = React.useState([]);

  const submitInfo = () => {
    setAllNames([ ...allNames, name ]);
  };

  return (
    <div>
      <nav className="header">
        <ul id="nav-bar">
          <li className="nav-item" tabIndex={0}>Home</li>
          <li className="nav-item" tabIndex={0}>About</li>
          <li className="nav-item" tabIndex={0}>Pricing</li>
          <li className="nav-item" tabIndex={0}>Partners</li>
          <li className="nav-item" tabIndex={0}>Contact</li>
        </ul>
      </nav>
      <main>
          <TextField 
            id="standard-basic" 
            label="First name:"
            type="text" 
            name="first-name" 
            value={name} 
            onChange={e => setName(e.target.value)}
          />
          <br />
          <ul>
            {allNames.map((n, idx) => (
              <Card
                key={idx} 
                style={{ width: '50px', height: '50px', display: 'inline-block'}}
              >
                {n}
              </Card>
            ))}
          </ul>
          
        <Button variant="contained" color="primary" id="form-submit" onClick={submitInfo}>Submit</Button>
      </main>
      <footer className="footer">
        &copy; Giant Apple 2020
      </footer>
    </div>
  );
}

export default App;
