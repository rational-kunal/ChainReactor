import React from 'react';
import './App.css';

import Game from "./components/Game";

function App() {
  return (
      <div className="App">
        <Game gridSize={{ rowCount:6, columnCount:4 }} playerCount={2} />
      </div>
  );
}

export default App;
