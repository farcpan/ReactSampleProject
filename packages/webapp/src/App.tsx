import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// components
import * as ApiPackage from 'api';
import { TestComponent } from 'components';
import { CheckboxTreeView, createTestTreeViewData, TreeViewData } from "./components/checkboxtreeview";

const useStyles = makeStyles((theme) =>({
  typo: {
    fontFamily: "'Noto Sans JP', 'Noto Sans KR', 'Noto Sans TC', sans-serif;",
    fontWeight: 700,
  },
  typo_tc: {
    fontFamily: "'Noto Sans TC', sans-serif;",
    fontWeight: 700,
  }
}));

const App = () => {
  const value = ApiPackage.test();

  const data: TreeViewData[] = createTestTreeViewData();

  const styles = useStyles();

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

      {/* font test area */}
      <div style={{ width: "100%", backgroundColor: "#ffddff", padding: "20px"}}>
        <Typography className={styles.typo}>テスト文章をここに書きます。フォントを比較します。Here is the font test space.</Typography>
        <Typography className={styles.typo_tc}>テスト文章をここに書きます。フォントを比較します。Here is the font test space.</Typography>
        <Typography>テスト文章をここに書きます。フォントを比較します。Here is the font test space.</Typography>
      </div>
    </div>
  );
}

export default App;
