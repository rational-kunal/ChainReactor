import React from 'react'
import './App.css'

import Board from './components/Board'

function App() {
    return (
        <div className="App">
            <Board
                classList="center"
                gridSize={{ rowCount: 6, columnCount: 4 }}
                playerCount={2}
            />
        </div>
    )
}

export default App
