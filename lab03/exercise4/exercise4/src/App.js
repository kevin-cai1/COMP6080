import React from 'react';
import logo from './cat.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <body className="App-body">
        <h1>You are safe now</h1>
        <h5>human</h5>
        <img src={logo} className="App-logo" alt="logo" />
        <div className="text-container">
          <p>
            You either die a hero, or live long enough to see yourself come the villain:
          </p>
          <ul>
            <li>
              <a
                className="App-link"
                href="https://www.youtube.com/watch?v=QH2-TGUlwu4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cat Video 1
              </a>
            </li>
            <li>
              <a
                className="App-link"
                href="https://www.youtube.com/watch?v=3TdPBB9Z_cs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cat Video 2
              </a>
            </li>
          </ul>
        </div>
      </body>
    </div>
  );
}

export default App;
