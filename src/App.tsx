

import './App.css';

import 
  DragDropList
from './components/DragDropList';

import { useEffect, useState } from 'react';

import data from "./be/dummy-be.json"


const App:React.FC = () => {

  return (
 
    <div className="app">
      <DragDropList query={data} />
    </div>
  )

  
}

export default App;