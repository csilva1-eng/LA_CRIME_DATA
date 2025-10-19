import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <nav className='nav-cont'>
        <h1 style={{ color: 'orange' }}>Crime Data Explorer</h1>
      </nav>

      <div className='main'>
        <label> Select region
          <select>
            <option value="San Fernando Valley">San Fernando Valley</option>
            <option value="Antelope Valley.">Antelope Valley</option>
            <option value="Central Los Angeles">Central Los Angeles</option>
          </select>
        </label>


        <div className='map'>
          
        </div>

        <div className='controls'>
          <label> x-axis
            <select></select>
          </label>

          <label> y-axis
            <select></select>
          </label>

        </div>

        <div className='search-buttons'>
          <button>DFS Search</button>
          <button>BFS Search</button>
        </div>

        <div>
          <button>Display!</button>
        </div>


      </div>

      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>Hello world this is me!!!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
