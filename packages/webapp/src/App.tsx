import React from 'react';
import logo from './logo.svg';
import './App.css';

// components
import * as ApiPackage from 'api';
import { TestComponent } from 'components';

function App() {
  const value = ApiPackage.test();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>{value}</div>
        <TestComponent />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
