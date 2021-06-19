import React from 'react';
import logo from './logo.svg';
import './App.css';

import { makeStyles, createStyles } from '@material-ui/core/styles';

// components
import * as ApiPackage from 'api';
import { TestComponent } from 'components';

import { Parent, Data, SubData } from './components'


// ダミーデータ作成処理
const TestData = () => {
  let testData: Data[] = []
  for (let i = 0; i < 10; i++) {
    let data: SubData[] = [];
    for (let j = 0; j < 4; j++) {
      const subDataDetail = [ `detail_${j}_1`, `detail_${j}_2`, `detail_${j}_3`, `detail_${j}_4`, `detail_${j}_5` ]
      data.push({ id: j, text: `subData_${j}`, data: subDataDetail, answer: -1 });
    }
    testData.push({ id: i, text: `Data_${i}`, data: data});
  }

  return testData;
}

const useStyles = makeStyles((theme) =>({
  content: {
      height: "500px",
      overflow: "scroll",
      width: "400px",
      backgroundColor: "#eeeeee",
      margin: "10px",
      padding: "10px",
  },
}));

// entry point of app
const App = () => {
  const value = ApiPackage.test();

  const t = TestData();
  // console.log(t);

  const styles = useStyles();

  return (
    <div>
      <TestComponent />
      <div>{value}</div>
      <div className={styles.content}>
      {
        t.map((value) => {
          return (
              <Parent data={value} onChange={(p, c, i) => {
                  console.log(`parent=${p}, child=${c}, index=${i}`);
              }} /> 
          )
        })        
      }
      </div>
    </div>
  );
}

export default App;
