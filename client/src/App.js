import {useState} from "react"
import logo from './logo.svg';
import './App.css';
import AppContainer from './components/AppContainer/AppContainer'
import '@tremor/react/dist/esm/tremor.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppContainer />
      </header>
    </div>
  );
}

export default App;
