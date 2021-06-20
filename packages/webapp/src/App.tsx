import React from 'react';
import logo from './logo.svg';
import './App.css';

// components
import * as ApiPackage from 'api';
import { TestComponent } from 'components';
import { CheckboxTreeView, createTestTreeViewData, TreeViewData } from "./components/checkboxtreeview";

function App() {
  const value = ApiPackage.test();

  const data: TreeViewData[] = createTestTreeViewData();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{ width: "150px "}} />
        <div>{value}</div>
        <TestComponent />
  
        <div style={{ overflow: "scroll", height: "400px", width: "800px", backgroundColor: "#dddddd"}}>
          <CheckboxTreeView 
            data={data} 
            onChange={(results) => { 
                results.forEach((result) => {
                  console.log(result);
                });
             }}/>
        </div>
  
        <a
          className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
